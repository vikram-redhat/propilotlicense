// Classify Air Regulations questions into the 22 RK Bali chapters (Eleventh Revised
// Edition, 2018, Captain Panel list), the Air Regulations syllabus map. Copied from
// scripts/classify-syllabus-chapters.mjs (Meteorology): same model, prompt shape, batch
// tool and source masking, with two Captain Panel rules added for chapters 14 and 19, and
// a 14/15 tie-break (licensing to 15 even under Indian rules) added after the first pilot.
//
//   node --env-file=.env.local scripts/classify-air-regs-chapters.mjs --seed-bvn
//
// --seed-bvn: set syllabus_chapter_id on the 66 Bharatiya Vayuyan Niyam questions from
// scripts/data/bvn26-rk-bali-chapters.json (chapter 14 or 15), source 'rule', confidence
// 'high'. Needs scripts/rk_bali_chapters_2018.sql. Only fills empty values.
//
//   node --env-file=.env.local scripts/classify-air-regs-chapters.mjs --pilot
//
// --pilot: a fixed random sample of 100 active Air Regulations questions (10 of the BVN
// questions, 15 of the questions flagged as teaching the repealed law, 75 others). Reads
// the database, writes nothing to it; results go to pilot_air_regs_classification.csv.
// The chapter list comes from scripts/data/rk-bali-chapters-2018.csv, the same file
// scripts/rk_bali_chapters_2018.sql was built from.
//
// The classifier sees each chapter's number, name, syllabus_topics and key_subtopics,
// and each question's text, options and explanation, with book names masked. It never
// sees the source book or source chapter.
//
// No --full mode yet: the full run waits for approval of the pilot.

import fs from 'node:fs'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const MODEL = 'claude-sonnet-4-6' // same as scripts/classify-syllabus-chapters.mjs
const BATCH_SIZE = 20
const CONCURRENCY = 4
const AIR_REGS_SUBJECT_ID = 'f27577f4-72cd-4f9b-9ec0-fedf966dd9d2'
const RK_BALI_BOOK_ID = '15db3a2f-0718-4f98-beeb-177d9b92a4a4'
const CHAPTER_COUNT = 22
const BVN_SEED = JSON.parse(fs.readFileSync('scripts/data/bvn26-rk-bali-chapters.json', 'utf8'))
const FLAGGED_IDS = new Set(JSON.parse(fs.readFileSync('scripts/data/air-regs-repealed-law-flags.json', 'utf8')).ids)
// claude-sonnet-4-6, $ per million tokens
const PRICE = { input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.3 }

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

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

// Minimal CSV reader for the chapter file (quoted fields, "" escapes, no newlines in fields).
function readChapterCsv(path) {
  const [header, ...lines] = fs.readFileSync(path, 'utf8').replace(/^﻿/, '').split(/\r?\n/).filter(Boolean)
  const parse = line => {
    const cells = []
    let cell = '', quoted = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (quoted) {
        if (ch === '"' && line[i + 1] === '"') { cell += '"'; i++ }
        else if (ch === '"') quoted = false
        else cell += ch
      } else if (ch === '"') quoted = true
      else if (ch === ',') { cells.push(cell); cell = '' }
      else cell += ch
    }
    cells.push(cell)
    return cells
  }
  const keys = parse(header)
  return lines.map(line => Object.fromEntries(parse(line).map((v, i) => [keys[i], v.trim() || null])))
    .map(r => ({ ...r, chapter_number: Number(r.chapter_number) }))
}

function loadChaptersFromCsv() {
  const chapters = readChapterCsv('scripts/data/rk-bali-chapters-2018.csv')
  if (chapters.length !== CHAPTER_COUNT) throw new Error(`Expected ${CHAPTER_COUNT} chapters in the CSV, got ${chapters.length}`)
  return chapters
}

async function loadChaptersFromDb() {
  const { data, error } = await supabase
    .from('chapters')
    .select('id, chapter_number, chapter_name, syllabus_topics, key_subtopics')
    .eq('book_id', RK_BALI_BOOK_ID)
    .not('verified_at', 'is', null)
    .order('chapter_number')
  if (error) throw new Error(error.message)
  if (data.length !== CHAPTER_COUNT) throw new Error(`Expected ${CHAPTER_COUNT} verified RK Bali chapters, got ${data.length}: run scripts/rk_bali_chapters_2018.sql first`)
  return data
}

// Plain columns only (embedding across ~2,500 rows hits the statement timeout). Books are
// joined here; options are fetched per batch.
async function loadQuestions() {
  const [questions, books] = await Promise.all([
    selectAll(() => supabase
      .from('questions')
      .select('id, question_text, explanation, source_book_id, external_ref')
      .eq('subject_id', AIR_REGS_SUBJECT_ID)
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

const bvnSeed = new Map(BVN_SEED.map(s => [s.question_id, s]))

function pilotSample(questions) {
  const rand = seededRandom(20261111)
  const bvn = shuffle(questions.filter(q => bvnSeed.has(q.id)), rand).slice(0, 10)
  const flagged = shuffle(questions.filter(q => FLAGGED_IDS.has(q.id)), rand).slice(0, 15)
  if (bvn.length !== 10 || flagged.length !== 15) throw new Error(`Sample short: ${bvn.length} BVN, ${flagged.length} flagged`)
  const taken = new Set([...bvn, ...flagged].map(q => q.id))
  const rest = shuffle(questions.filter(q => !taken.has(q.id) && !bvnSeed.has(q.id)), rand).slice(0, 100 - taken.size)
  return [
    ...bvn.map(q => ({ ...q, group: 'bvn' })),
    ...flagged.map(q => ({ ...q, group: 'repealed_law_flag' })),
    ...rest.map(q => ({ ...q, group: 'random' })),
  ]
}

// ── Classifier ───────────────────────────────────────────────────────────────

// Book names and page/chapter references occasionally appear in explanations
// ("as Bali explains…"); mask them so the citation can't steer the topic decision.
const SOURCE_PATTERN = /\b(R\.?\s?K\.?\s+Bali|Bali|Oxford(\s+Aviation\s+Academy)?|Nordian|Krishnan|Chopra|Bob\s+Tait|Tait|chapter\s+\d+|page\s+\d+)\b/gi
const mask = text => (text ?? '').replace(SOURCE_PATTERN, '[source]')

function systemPrompt(chapters) {
  const list = chapters.map(c => [
    `Chapter ${c.chapter_number}: ${c.chapter_name}`,
    `  Syllabus topics: ${c.syllabus_topics ?? '—'}`,
    `  Key subtopics: ${c.key_subtopics ?? '—'}`,
  ].join('\n')).join('\n\n')

  return `You classify DGCA (India) CPL/ATPL Air Regulations exam questions by syllabus topic.

The syllabus is organised into the ${CHAPTER_COUNT} chapters below. For each question, choose the ONE chapter whose content the question primarily tests — the chapter where a student would learn what is needed to answer it.

${list}

Guidance:
- Judge by the concept being tested, not by incidental words. A question about a radio report that happens to mention a runway tests communications, not aerodromes.
- Several topics appear in more than one chapter (for example wake turbulence, flight plans, documents, ADIZ). Choose the chapter where the question's core concept is taught in depth.
- Chapter 14 (National Law) covers Indian national law under both the old and new frameworks: the Aircraft Act, 1934 and the Aircraft Rules, 1937, and the Bharatiya Vayuyan Adhiniyam, 2024 and the Bharatiya Vayuyan Niyam, 2026. Questions on Indian rules, offences, documents, crew conduct and DGCA powers go to chapter 14, even if the topic also appears in an ICAO Annex.
- Tie-break between chapters 14 and 15: licence requirements, licence validity, medicals, ratings and licence privileges go to chapter 15 (Personnel Licensing), even when the question is under Indian rules. Everything else on Indian law goes to chapter 14.
- Chapter 19 (Communications) covers METAR, TAF and SIGMET in this subject. Questions on these reports and codes belong in chapter 19; don't send them elsewhere.
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
            chapter: { type: 'integer', description: `Chapter number, 1 to ${CHAPTER_COUNT}` },
            confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
            reason: { type: 'string', description: '15 words or fewer' },
          },
        },
      },
    },
  },
}

const usage = { input: 0, output: 0, cacheWrite: 0, cacheRead: 0, calls: 0 }
let anthropic

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
      return r && Number.isInteger(r.chapter) && r.chapter >= 1 && r.chapter <= CHAPTER_COUNT
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
  const byNumber = new Map(chapters.map(c => [c.chapter_number, c]))
  const header = ['question_id', 'ref', 'source_book', 'question_text', 'assigned_chapter', 'confidence', 'reason', 'seed_chapter', 'agrees_with_seed', 'sample_group']
  const lines = [header.join(',')]
  for (const r of results) {
    const q = r.question
    const book = q.source_book ? `${q.source_book.author ?? ''} — ${q.source_book.title}` : '(no book)'
    const seed = bvnSeed.get(q.id)
    const seedChapter = seed ? byNumber.get(seed.rk_bali_chapter) : null
    lines.push([
      q.id, q.external_ref ?? '', book, (q.question_text ?? '').replace(/\s+/g, ' ').slice(0, 120),
      `${r.chapter} ${byNumber.get(r.chapter).chapter_name}`, r.confidence, r.reason,
      seedChapter ? `${seedChapter.chapter_number} ${seedChapter.chapter_name}` : '',
      seedChapter ? (seedChapter.chapter_number === r.chapter ? 'yes' : 'no') : '',
      q.group,
    ].map(csvCell).join(','))
  }
  fs.writeFileSync(path, lines.join('\n') + '\n')
}

// ── Main ─────────────────────────────────────────────────────────────────────

const mode = process.argv[2]
if (!['--seed-bvn', '--pilot'].includes(mode)) {
  console.error('Usage: node --env-file=.env.local scripts/classify-air-regs-chapters.mjs --seed-bvn | --pilot')
  process.exit(1)
}

if (mode === '--seed-bvn') {
  const byNumber = new Map((await loadChaptersFromDb()).map(c => [c.chapter_number, c]))
  let written = 0, skipped = 0
  for (const s of BVN_SEED) {
    const { data, error } = await supabase
      .from('questions')
      .update({ syllabus_chapter_id: byNumber.get(s.rk_bali_chapter).id, syllabus_chapter_source: 'rule', syllabus_chapter_confidence: 'high' })
      .eq('id', s.question_id)
      .eq('external_ref', s.ref)
      .is('syllabus_chapter_id', null)
      .select('id')
    if (error) throw new Error(`Seed ${s.ref}: ${error.message}`)
    if (data.length) written++
    else skipped++
  }
  console.log(`BVN seed: ${written} written, ${skipped} already set or not found (of ${BVN_SEED.length})`)
  process.exit(0)
}

anthropic = new Anthropic({ maxRetries: 4 })
const chapters = loadChaptersFromCsv()
const questions = await loadQuestions()
console.log(`${questions.length} active Air Regulations questions`)
const sample = pilotSample(questions)
console.log(`Pilot sample: ${sample.length} (${sample.filter(q => q.group === 'bvn').length} BVN, ${sample.filter(q => q.group === 'repealed_law_flag').length} repealed-law flags)`)

const results = await classifyAll(systemPrompt(chapters), sample)
const outPath = 'pilot_air_regs_classification.csv'
writePilotCsv(outPath, results, chapters)
fs.writeFileSync('pilot_air_regs_classification.usage.json', JSON.stringify({ model: MODEL, ...usage, cost_usd: cost() }, null, 2))
console.log(`Wrote ${outPath} (${results.length} rows)`)
console.log(`Tokens: input ${usage.input}, output ${usage.output}, cache write ${usage.cacheWrite}, cache read ${usage.cacheRead}, ${usage.calls} calls — $${cost().toFixed(3)}`)
