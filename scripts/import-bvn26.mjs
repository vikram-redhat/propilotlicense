// Import the Bharatiya Vayuyan Niyam, 2026 question batch into Air Regulations.
//
// Source: scripts/data/bvn26-batch1.json (from bvn-2026-questions-batch1.csv). Each row
// becomes an active, unreviewed question (so it leads the review queue) under a legal
// source_books row for the rules. Options are already shuffled and kept as given.
//   difficulty: easy → basic; medium, hard → advanced
//   source_chapter = citation ("Rule 174(1)"); source_page = "Gazette p. <gazette_page>"
//   external_ref = ref (BVN26-001 …), citation_verified = true
// RK Bali chapters aren't in the database yet, so each question's rk_bali_chapter is
// written to scripts/data/bvn26-rk-bali-chapters.json for linking later.
//
// Needs scripts/migrate_source_kind_external_ref.sql. Safe to re-run: refs already in
// the bank are skipped.
//
//   node --env-file=.env.local scripts/import-bvn26.mjs
import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const AIR_REGULATIONS = 'f27577f4-72cd-4f9b-9ec0-fedf966dd9d2'
const RK_BALI = '15db3a2f-0718-4f98-beeb-177d9b92a4a4'
const BOOK = {
  subject_id: AIR_REGULATIONS,
  title: 'Bharatiya Vayuyan Niyam, 2026',
  author: 'Ministry of Civil Aviation, Government of India',
  edition: 'G.S.R. 957(E), 26 October 2026',
  source_kind: 'legal',
}
const DIFFICULTY = { easy: 'basic', medium: 'advanced', hard: 'advanced' }
const LETTERS = ['A', 'B', 'C', 'D']

const rows = JSON.parse(fs.readFileSync('scripts/data/bvn26-batch1.json', 'utf8'))
for (const r of rows) {
  const opts = LETTERS.map(l => r[`option_${l.toLowerCase()}`])
  if (!LETTERS.includes(r.correct_option)) throw new Error(`${r.ref}: correct_option ${r.correct_option}`)
  if (opts.some(o => !o) || new Set(opts.map(o => o.toLowerCase())).size !== 4) throw new Error(`${r.ref}: options`)
  if (!r.citation || !r.gazette_page || !DIFFICULTY[r.difficulty]) throw new Error(`${r.ref}: citation, page or difficulty`)
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const must = ({ data, error }, label) => { if (error) throw new Error(`${label}: ${error.message}`); return data }

// The source: same licence types and countries as RK Bali.
const bali = must(await supabase.from('source_books').select('licence_types, countries').eq('id', RK_BALI).single(), 'RK Bali')
let book = must(await supabase.from('source_books').select('id').eq('subject_id', AIR_REGULATIONS).eq('title', BOOK.title).maybeSingle(), 'find book')
if (!book) {
  book = must(await supabase.from('source_books').insert({ ...BOOK, licence_types: bali.licence_types, countries: bali.countries, sort_order: 0 }).select('id').single(), 'insert book')
  console.log(`source book created ${book.id}`)
}

const existing = new Map(must(await supabase.from('questions').select('id, external_ref').in('external_ref', rows.map(r => r.ref)), 'existing')
  .map(q => [q.external_ref, q.id]))
for (const r of rows.filter(r => !existing.has(r.ref))) {
  const q = must(await supabase.from('questions').insert({
    subject_id: AIR_REGULATIONS,
    source_book_id: book.id,
    question_text: r.question_text,
    difficulty: DIFFICULTY[r.difficulty],
    explanation: r.explanation,
    source_chapter: r.citation,
    source_page: `Gazette p. ${r.gazette_page}`,
    citation_verified: true,
    source_type: 'ai',
    active: true,
    flagged: false,
    external_ref: r.ref,
  }).select('id').single(), `insert ${r.ref}`)
  const { error } = await supabase.from('question_options').insert(LETTERS.map(l => ({
    question_id: q.id, option_letter: l, option_text: r[`option_${l.toLowerCase()}`], is_correct: l === r.correct_option,
  })))
  if (error) {
    await supabase.from('questions').delete().eq('id', q.id)
    throw new Error(`options ${r.ref}: ${error.message}`)
  }
  existing.set(r.ref, q.id)
}
console.log(`${rows.length} rows; ${existing.size} in the bank`)

fs.writeFileSync('scripts/data/bvn26-rk-bali-chapters.json', JSON.stringify(
  rows.map(r => ({ ref: r.ref, question_id: existing.get(r.ref), rk_bali_chapter: Number(r.rk_bali_chapter) })), null, 1) + '\n')
console.log(`/admin/review?ids=${rows.map(r => existing.get(r.ref)).join(',')}`)
