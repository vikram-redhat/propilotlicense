import { unstable_cache } from 'next/cache'
import { getBookBySlug } from '@/lib/books'
import { countChapterQuestions } from '@/lib/chapter-question-counts'
import { createServiceClient } from '@/lib/supabase'
import { SUBJECTS } from '@/lib/subjects'
import { isSyllabusBook, SYLLABUS_BOOK_IDS } from '@/lib/syllabus'

// Live question counts for page copy, so no page carries a hand-typed total.
//
// Cached for an hour. unstable_cache serves the last good value when a refresh fails, so
// a database outage keeps showing the previous numbers. It only throws when there is no
// cached value at all (first request after a deploy) and the database fails: ISR pages
// then keep their last good render; per-request pages use the *OrFallback helpers.

type SubjectCount = { code: string | null; count: number }

// Active questions per subject — the homepage's rule.
export const subjectQuestionCounts = unstable_cache(async (): Promise<SubjectCount[]> => {
  const supabase = createServiceClient()
  const { data: subjects, error } = await supabase.from('subjects').select('id, code').eq('active', true)
  if (error) throw new Error(`Subject counts: ${error.message}`)
  const counts = await Promise.all(subjects.map(s =>
    supabase.from('questions').select('id', { count: 'exact', head: true }).eq('active', true).eq('subject_id', s.id)))
  return subjects.map((s, i) => {
    if (counts[i].error) throw new Error(`Subject counts: ${counts[i].error!.message}`)
    return { code: s.code, count: counts[i].count ?? 0 }
  })
}, ['subject-question-counts'], { revalidate: 3600 })

// What a book's whole-book practice draws. A syllabus book (IC Joshi, RK Bali): every question on
// its syllabus chapters, from any source book (the sum the practice picker shows an
// Indian student). Any other book: the active questions that cite it.
export const bookQuestionTotal = unstable_cache(async (slug: string): Promise<number> => {
  const book = getBookBySlug(slug)
  if (!book) throw new Error(`Unknown book ${slug}`)
  const bookId = 'sourceBookId' in book ? book.sourceBookId : book.questionsBookId
  const supabase = createServiceClient()
  if (isSyllabusBook(bookId)) {
    const [bookRes, chaptersRes] = await Promise.all([
      supabase.from('source_books').select('subject_id').eq('id', bookId).single(),
      supabase.from('chapters').select('id').eq('book_id', bookId),
    ])
    if (bookRes.error) throw new Error(`Question count for ${slug}: ${bookRes.error.message}`)
    if (chaptersRes.error) throw new Error(`Question count for ${slug}: ${chaptersRes.error.message}`)
    const counts = await countChapterQuestions(supabase, {
      subjectId: bookRes.data.subject_id, bookId, chapterIds: chaptersRes.data.map(c => c.id), country: 'IN',
    })
    return Object.values(counts).reduce((a, b) => a + b, 0)
  }
  const { count, error } = await supabase.from('questions').select('id', { count: 'exact', head: true })
    .eq('active', true).eq('source_book_id', bookId)
  if (error) throw new Error(`Question count for ${slug}: ${error.message}`)
  return count ?? 0
}, ['book-question-total', ...SYLLABUS_BOOK_IDS], { revalidate: 3600 })

// The five CPL theory subjects (lib/subjects.ts). subjects.licence_types can't be used:
// every subject, A320 included, is tagged CPL and ATPL.
const CPL_CODES: ReadonlySet<string> = new Set(SUBJECTS.map(s => s.code))

export async function questionTotals() {
  const subjects = await subjectQuestionCounts()
  const sum = (rows: SubjectCount[]) => rows.reduce((a, s) => a + s.count, 0)
  return {
    all: sum(subjects),
    cpl: sum(subjects.filter(s => s.code != null && CPL_CODES.has(s.code))),
    a320: sum(subjects.filter(s => s.code === 'A320FAMILY')),
    bySubject: Object.fromEntries(subjects.filter(s => s.code).map(s => [s.code!, s.count])) as Record<string, number>,
  }
}

// "14,000+": rounded down to the thousand, for headline claims.
export function roundedTotal(n: number): string {
  return `${(Math.floor(n / 1000) * 1000).toLocaleString('en-US')}+`
}

// Snapshot (2026-11-08) used only when there is no cached value and the database is down,
// so a per-request page still renders instead of erroring.
const SNAPSHOT = { all: 14387, cpl: 12698, a320: 1687 }

export async function questionTotalsOrFallback() {
  try {
    return await questionTotals()
  } catch (e) {
    console.error(e)
    return { ...SNAPSHOT, bySubject: {} as Record<string, number> }
  }
}

export async function bookQuestionTotalOrNull(slug: string): Promise<number | null> {
  try {
    return await bookQuestionTotal(slug)
  } catch (e) {
    console.error(e)
    return null
  }
}
