// Classify Meteorology questions into the 26 verified IC Joshi syllabus chapters
// (Brief B). Uses the same model and ANTHROPIC_API_KEY as question generation.
//
//   node --env-file=.env.local scripts/classify-syllabus-chapters.mjs --pilot
//
// --pilot: a fixed random sample of 100 active Meteorology questions (all 7 Brief A
// conflicts, 20 seeded IC Joshi questions, 73 others). Reads the database, writes
// nothing to it; results go to pilot_syllabus_classification.csv.
//
// The classifier sees each chapter's number, name, syllabus_topics and key_subtopics,
// and each question's text, options and explanation, with book names masked. It never
// sees the source book or source chapter.

import fs from 'node:fs'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const MODEL = 'claude-sonnet-4-6' // same as app/api/admin/generate/route.ts
const BATCH_SIZE = 20
const CONCURRENCY = 4
const MET_SUBJECT_ID = '8fb7f480-4073-47db-991d-80f78ee3520a'
const JOSHI_BOOK_ID = 'd05dc941-d49b-4fb3-aab8-a1759e518e8b'
const CONFLICT_IDS = [
  '07597585-ce92-4a75-98af-f29ce98e7e4f',
  '9fe48085-f2ce-451f-b7ee-08c5c0a941eb',
  '9ddfa083-29b4-4b4a-a564-76395d9eb99c',
  'cb697b24-b73e-4f92-8bf4-9a7a554ae1f8',
  'aeeb06ea-d2ff-4f93-b4b7-bd15a8930c21',
  '5b6296d3-0dad-43c8-874a-6e24211caf6c',
  'c3179b92-7598-4c4e-a3dd-6ec9f8cc8dab',
]
// claude-sonnet-4-6, $ per million tokens
const PRICE = { input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.3 }

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const anthropic = new Anthropic({ maxRetries: 4 })

// ── Data ─────────────────────────────────────────────────────────────────────

async function selectAll(build) {
  const rows = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await build().range(from, from + 999)
    if (error) throw new Error(error.message)
    rows.push(...data)
    if (data.length < 1000) return rows
  }
}

async function loadChapters() {
  const { data, error } = await supabase
    .from('chapters')
    .select('id, chapter_number, chapter_name, syllabus_topics, key_subtopics')
    .eq('book_id', JOSHI_BOOK_ID)
    .order('chapter_number')
  if (error) throw new Error(error.message)
  if (data.length !== 26) throw new Error(`Expected 26 IC Joshi chapters, got ${data.length}`)
  return data
}

// Plain columns only: embedding options/books across all ~2,700 rows hits the
// statement timeout. Books are joined here; options are fetched per batch.
async function loadQuestions() {
  const [questions, books] = await Promise.all([
    selectAll(() => supabase
      .from('questions')
      .select('id, question_text, explanation, source_book_id, chapter_id')
      .eq('subject_id', MET_SUBJECT_ID)
      .eq('active', true)
      .order('id')),
    selectAll(() => supabase.from('source_books').select('id, title, author').order('id')),
  ])
  const bookById = new Map(books.map(b => [b.id, b]))
  return questions.map(q => ({ ...q, source_book: bookById.get(q.source_book_id) ?? null }))
}

async function loadOptions(questionIds) {
  const { data, error } = await supabase
    .from('question_options')
    .select('question_id, option_letter, option_text, is_correct')
    .in('question_id', questionIds)
  if (error) throw new Error(error.message)
  const byQuestion = new Map()
  for (const o of data) {
    if (!byQuestion.has(o.question_id)) byQuestion.set(o.question_id, [])
    byQuestion.get(o.question_id).push(o)
  }
  return byQuestion
}

// ── Sampling (deterministic, so the pilot can be re-run identically) ─────────

function seededRandom(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle(items, rand) {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pilotSample(questions) {
  const rand = seededRandom(20261103)
  const conflicts = questions.filter(q => CONFLICT_IDS.includes(q.id))
  if (conflicts.length !== 7) throw new Error(`Found ${conflicts.length} of the 7 conflict questions`)
  const seeded = questions.filter(q => q.source_book_id === JOSHI_BOOK_ID && q.chapter_id && !CONFLICT_IDS.includes(q.id))
  const joshi = shuffle(seeded, rand).slice(0, 20)
  const taken = new Set([...conflicts, ...joshi].map(q => q.id))
  const rest = shuffle(questions.filter(q => !taken.has(q.id)), rand).slice(0, 100 - taken.size)
  return [
    ...conflicts.map(q => ({ ...q, group: 'conflict' })),
    ...joshi.map(q => ({ ...q, group: 'seeded_joshi' })),
    ...rest.map(q => ({ ...q, group: 'random' })),
  ]
}

// ── Classifier ───────────────────────────────────────────────────────────────

// Book names and page/chapter references occasionally appear in explanations
// ("as Joshi explains…"); mask them so the citation can't steer the topic decision.
const SOURCE_PATTERN = /\b(I\.?\s?C\.?\s+Joshi|Joshi|Oxford(\s+Aviation\s+Academy)?|Underdown(\s*(&|and)\s*Standen)?|Standen|Wickson|Nordian|Trevor\s+Thom|chapter\s+\d+|page\s+\d+)\b/gi
const mask = text => (text ?? '').replace(SOURCE_PATTERN, '[source]')

function systemPrompt(chapters) {
  const list = chapters.map(c => [
    `Chapter ${c.chapter_number}: ${c.chapter_name}`,
    `  Syllabus topics: ${c.syllabus_topics ?? '—'}`,
    `  Key subtopics: ${c.key_subtopics ?? '—'}`,
  ].join('\n')).join('\n\n')

  return `You classify DGCA (India) CPL/ATPL Meteorology exam questions by syllabus topic.

The syllabus is organised into the 26 chapters below. For each question, choose the ONE chapter whose content the question primarily tests — the chapter where a student would learn what is needed to answer it.

${list}

Guidance:
- Judge by the concept being tested, not by incidental words. A question about reading a METAR that happens to mention fog tests reports and codes, not fog.
- Several topics appear in more than one chapter (for example wind shear, turbulence, ITCZ, icing). Choose the chapter where the question's core concept is taught in depth.
- Confidence: "high" = clearly belongs to one chapter; "medium" = one chapter is best but another is plausible; "low" = weak fit or genuinely spans several chapters.
- Reason: 15 words or fewer, naming the concept that decided it.

Record every question with the record_classifications tool, using each question's key exactly as given.`
}

const TOOL = {
  name: 'record_classifications',
  description: 'Record the syllabus chapter for every question in the batch.',
  strict: true,
  input_schema: {
    type: 'object',
    additionalProperties: false,
    required: ['results'],
    properties: {
      results: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['key', 'chapter', 'confidence', 'reason'],
          properties: {
            key: { type: 'string' },
            chapter: { type: 'integer', description: 'Chapter number, 1 to 26' },
            confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
            reason: { type: 'string', description: '15 words or fewer' },
          },
        },
      },
    },
  },
}

const usage = { input: 0, output: 0, cacheWrite: 0, cacheRead: 0, calls: 0 }

async function classifyBatch(system, batch) {
  const options = await loadOptions(batch.map(q => q.id))
  batch = batch.map(q => ({ ...q, options: options.get(q.id) ?? [] }))
  const payload = batch.map((q, i) => ({
    key: `q${i + 1}`,
    question: mask(q.question_text),
    options: [...(q.options ?? [])]
      .sort((a, b) => a.option_letter.localeCompare(b.option_letter))
      .map(o => `${o.option_letter}. ${mask(o.option_text)}${o.is_correct ? '  (correct)' : ''}`),
    explanation: mask(q.explanation),
  }))

  for (let attempt = 1; attempt <= 2; attempt++) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      tools: [TOOL],
      tool_choice: { type: 'tool', name: TOOL.name },
      messages: [{ role: 'user', content: `Classify these ${batch.length} questions:\n\n${JSON.stringify(payload, null, 1)}` }],
    })
    usage.calls++
    usage.input += response.usage.input_tokens
    usage.output += response.usage.output_tokens
    usage.cacheWrite += response.usage.cache_creation_input_tokens ?? 0
    usage.cacheRead += response.usage.cache_read_input_tokens ?? 0

    const block = response.content.find(b => b.type === 'tool_use')
    const results = new Map((block?.input?.results ?? []).map(r => [r.key, r]))
    const valid = payload.every(p => {
      const r = results.get(p.key)
      return r && Number.isInteger(r.chapter) && r.chapter >= 1 && r.chapter <= 26
    })
    if (valid) return batch.map((q, i) => ({ question: q, ...results.get(`q${i + 1}`) }))
    console.warn(`  batch incomplete or invalid (attempt ${attempt}, stop_reason ${response.stop_reason}) — retrying`)
  }
  throw new Error('Batch failed validation twice')
}

async function classifyAll(system, questions) {
  const batches = []
  for (let i = 0; i < questions.length; i += BATCH_SIZE) batches.push(questions.slice(i, i + BATCH_SIZE))
  const out = []
  // First batch alone so the system prompt is cached before the rest run in parallel.
  out.push(...await classifyBatch(system, batches[0]))
  console.log(`  batch 1/${batches.length} done`)
  for (let i = 1; i < batches.length; i += CONCURRENCY) {
    const group = batches.slice(i, i + CONCURRENCY)
    const results = await Promise.all(group.map(b => classifyBatch(system, b)))
    results.forEach(r => out.push(...r))
    console.log(`  batches ${i + 1}–${i + group.length}/${batches.length} done`)
  }
  return out
}

function cost() {
  return (usage.input * PRICE.input + usage.output * PRICE.output +
    usage.cacheWrite * PRICE.cacheWrite + usage.cacheRead * PRICE.cacheRead) / 1e6
}

// ── Output ───────────────────────────────────────────────────────────────────

const csvCell = v => {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function writePilotCsv(path, results, chapters) {
  const byId = new Map(chapters.map(c => [c.id, c]))
  const byNumber = new Map(chapters.map(c => [c.chapter_number, c]))
  const header = ['question_id', 'source_book', 'question_text', 'assigned_chapter', 'confidence', 'reason', 'brief_a_chapter', 'agrees_with_brief_a', 'sample_group']
  const lines = [header.join(',')]
  for (const r of results) {
    const q = r.question
    const book = q.source_book ? `${q.source_book.author} — ${q.source_book.title}` : '(no book)'
    const assigned = byNumber.get(r.chapter)
    const briefA = q.source_book_id === JOSHI_BOOK_ID ? byId.get(q.chapter_id) : null
    lines.push([
      q.id, book, (q.question_text ?? '').replace(/\s+/g, ' ').slice(0, 120),
      `${r.chapter} ${assigned.chapter_name}`, r.confidence, r.reason,
      briefA ? `${briefA.chapter_number} ${briefA.chapter_name}` : '',
      briefA ? (briefA.chapter_number === r.chapter ? 'yes' : 'no') : '',
      q.group,
    ].map(csvCell).join(','))
  }
  fs.writeFileSync(path, lines.join('\n') + '\n')
}

// ── Main ─────────────────────────────────────────────────────────────────────

const mode = process.argv[2]
if (mode !== '--pilot') {
  console.error('Usage: node --env-file=.env.local scripts/classify-syllabus-chapters.mjs --pilot')
  console.error('(The full run is added after the pilot has been reviewed.)')
  process.exit(1)
}

const chapters = await loadChapters()
const questions = await loadQuestions()
console.log(`${questions.length} active Meteorology questions`)
const sample = pilotSample(questions)
console.log(`Pilot sample: ${sample.length} (${sample.filter(q => q.group === 'conflict').length} conflicts, ${sample.filter(q => q.group === 'seeded_joshi').length} seeded IC Joshi)`)

const results = await classifyAll(systemPrompt(chapters), sample)
const outPath = 'pilot_syllabus_classification.csv'
writePilotCsv(outPath, results, chapters)
fs.writeFileSync('pilot_syllabus_classification.usage.json', JSON.stringify({ model: MODEL, ...usage, cost_usd: cost() }, null, 2))
console.log(`Wrote ${outPath} (${results.length} rows)`)
console.log(`Tokens: input ${usage.input}, output ${usage.output}, cache write ${usage.cacheWrite}, cache read ${usage.cacheRead}, ${usage.calls} calls — $${cost().toFixed(3)}`)
