// Rebalance which letter (A–D) holds the correct answer.
//
// The AI generator put the correct answer at B ~61% of the time (its prompt example said
// "correct_option":"B"). This re-letters each active question's options so that, within
// every subject, the correct answer sits at A, B, C and D equally often; the other three
// options are shuffled into the remaining letters.
//
// Option rows keep their ids and text — only option_letter changes — so past answers
// (session_answers.selected_option_id) still point at the same option and past scores
// are unchanged. Explanation references such as "option B" / "options A and C" are
// remapped to the new letters. Questions whose option text names other options
// ("Both B and C") keep their order.
//
//   node --env-file=.env.local scripts/rebalance-option-letters.mjs --plan <before.json> <out-dir>
//   node --env-file=.env.local scripts/rebalance-option-letters.mjs --apply <out-dir>/plan.json
//
// <before.json> is a dump of questions + question_options (the backup); --plan writes
// plan.json and explanation-changes.txt for review. --apply writes the plan in batches of
// whole questions and is safe to re-run.
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const LETTERS = ['A', 'B', 'C', 'D']
// Keyword in either case; the letter must be a capital A–D (so "answer a question" never matches).
const OPTION_REF = /\b([Oo]ptions?|[Aa]nswers?|[Cc]hoices?)(\s+)\(?([A-D])\)?((?:\s*(?:,|and|or|&|\/)\s*\(?[A-D]\)?)*)/g
const NAMES_OTHER_OPTIONS = /\b(both|neither|either)\s+[A-D]\s+(and|nor|or)\b|\b[A-D]\s*(,|and|&)\s*[A-D]\s+(are|is)\b|\ball of the above\b|\bnone of the above\b/i

// Deterministic PRNG (mulberry32) so a re-run of --plan gives the same plan.
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function shuffle(arr, rand) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

// "option B" → "option D", "options A and C" → "options B and A" (letters mapped in place).
function remapRefs(text, map) {
  return text.replace(OPTION_REF, (m, word, space, first, rest) => {
    const head = m.slice(0, m.indexOf(first, word.length + space.length))
    return head + map[first] + m.slice(head.length + 1).replace(/[A-D]/g, l => map[l])
  })
}

function plan(beforePath, outDir) {
  const { questions, options } = JSON.parse(fs.readFileSync(beforePath, 'utf8'))
  const byQ = new Map()
  for (const o of options) (byQ.get(o.question_id) ?? byQ.set(o.question_id, []).get(o.question_id)).push(o)

  const skipped = { notFourOptions: [], namesOtherOptions: [] }
  const bySubject = new Map()
  for (const q of questions) {
    if (!q.active) continue
    const os = byQ.get(q.id) ?? []
    const letters = new Set(os.map(o => o.option_letter))
    if (os.length !== 4 || letters.size !== 4 || os.filter(o => o.is_correct).length !== 1) { skipped.notFourOptions.push(q.id); continue }
    if (os.some(o => NAMES_OTHER_OPTIONS.test(o.option_text))) { skipped.namesOtherOptions.push(q.id); continue }
    ;(bySubject.get(q.subject_id) ?? bySubject.set(q.subject_id, []).get(q.subject_id)).push(q)
  }

  const rand = rng(20261108)
  const changes = []
  const explanationDiffs = []
  for (const [, qs] of bySubject) {
    // Exactly balanced within the subject: shuffle the questions, then deal target
    // letters A, B, C, D in turn.
    shuffle(qs, rand).forEach((q, i) => {
      const os = byQ.get(q.id)
      const correct = os.find(o => o.is_correct)
      const target = LETTERS[i % 4]
      const others = shuffle(os.filter(o => !o.is_correct), rand)
      const free = LETTERS.filter(l => l !== target)
      const map = { [correct.option_letter]: target }
      others.forEach((o, k) => { map[o.option_letter] = free[k] })
      const explanation = q.explanation ? remapRefs(q.explanation, map) : q.explanation
      if (explanation !== q.explanation) explanationDiffs.push({ id: q.id, before: q.explanation, after: explanation, map })
      changes.push({
        question_id: q.id,
        map,
        options: os.map(o => ({ id: o.id, question_id: q.id, option_letter: map[o.option_letter], option_text: o.option_text, is_correct: o.is_correct })),
        ...(explanation !== q.explanation ? { explanation } : {}),
      })
    })
  }

  const tally = {}
  for (const c of changes) { const l = c.options.find(o => o.is_correct).option_letter; tally[l] = (tally[l] ?? 0) + 1 }
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'plan.json'), JSON.stringify({ changes, skipped }))
  fs.writeFileSync(path.join(outDir, 'explanation-changes.txt'), explanationDiffs.map(d =>
    `### ${d.id}  map ${JSON.stringify(d.map)}\n- ${d.before}\n+ ${d.after}\n`).join('\n'))
  console.log(`planned ${changes.length} questions; correct letter after: ${JSON.stringify(tally)}`)
  console.log(`explanations changed: ${explanationDiffs.length}; skipped: ${skipped.notFourOptions.length} without 4 options/1 correct, ${skipped.namesOtherOptions.length} naming other options`)
}

async function apply(planPath) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const { changes } = JSON.parse(fs.readFileSync(planPath, 'utf8'))
  const withRetry = async (fn, label) => {
    for (let attempt = 1; ; attempt++) {
      const { error } = await fn()
      if (!error) return
      if (attempt >= 4) throw new Error(`${label}: ${error.message}`)
      await new Promise(r => setTimeout(r, 1000 * attempt))
    }
  }
  const BATCH = 125 // whole questions → 500 option rows per request
  for (let i = 0; i < changes.length; i += BATCH) {
    const batch = changes.slice(i, i + BATCH)
    await withRetry(() => supabase.from('question_options').upsert(batch.flatMap(c => c.options), { onConflict: 'id' }), `options batch ${i}`)
    for (const c of batch.filter(c => c.explanation !== undefined)) {
      await withRetry(() => supabase.from('questions').update({ explanation: c.explanation }).eq('id', c.question_id), `explanation ${c.question_id}`)
    }
    process.stdout.write(`\r${Math.min(i + BATCH, changes.length)}/${changes.length}`)
  }
  console.log('\ndone')
}

const [mode, a, b] = process.argv.slice(2)
if (mode === '--plan') plan(a, b)
else if (mode === '--apply') await apply(a)
else { console.error('Usage: --plan <before.json> <out-dir> | --apply <plan.json>'); process.exit(1) }
