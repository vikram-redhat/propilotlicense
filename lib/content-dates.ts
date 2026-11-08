import { unstable_cache } from 'next/cache'
import { createServiceClient } from '@/lib/supabase'
import { isSyllabusBook } from '@/lib/syllabus'

// When the database-built parts of the subject and book pages last changed, for the
// sitemap's lastmod. Questions have no edited-at column, so a question counts from the
// later of when it was created (it changes the page's question count) and when it was last
// reviewed (last_reviewed_at); a book's chapters count from chapters.verified_at (weights,
// topics). Cached for an hour, like lib/live-counts.ts.

export type DbContentDates = {
  bySubjectCode: Record<string, string> // newest active question per subject
  byBookId: Record<string, string> // newest active question or chapter change per book
}

const latest = (...dates: (string | null | undefined)[]) =>
  dates.filter((d): d is string => !!d).sort().at(-1)

// The newest created_at or last_reviewed_at among the active questions matching filter.
async function newestQuestion(filter: { subject_id?: string; source_book_id?: string }): Promise<string | undefined> {
  const supabase = createServiceClient()
  const newest = async (column: 'created_at' | 'last_reviewed_at') => {
    let q = supabase.from('questions').select(column).eq('active', true).not(column, 'is', null)
    if (filter.subject_id) q = q.eq('subject_id', filter.subject_id)
    if (filter.source_book_id) q = q.eq('source_book_id', filter.source_book_id)
    const { data, error } = await q.order(column, { ascending: false }).limit(1)
    if (error) throw new Error(`Content dates: ${error.message}`)
    return (data[0] as Record<string, string> | undefined)?.[column]
  }
  const [created, reviewed] = await Promise.all([newest('created_at'), newest('last_reviewed_at')])
  return latest(created, reviewed)
}

export const dbContentDates = unstable_cache(async (bookIds: string[]): Promise<DbContentDates> => {
  const supabase = createServiceClient()
  const { data: subjects, error } = await supabase.from('subjects').select('id, code').eq('active', true)
  if (error) throw new Error(`Content dates: ${error.message}`)
  const subjectDates = await Promise.all(subjects.map(s => newestQuestion({ subject_id: s.id })))
  const bySubjectId = Object.fromEntries(subjects.map((s, i) => [s.id, subjectDates[i]]))

  const byBookId: Record<string, string> = {}
  await Promise.all(bookIds.map(async bookId => {
    const [bookRes, chapterRes] = await Promise.all([
      supabase.from('source_books').select('subject_id').eq('id', bookId).single(),
      supabase.from('chapters').select('verified_at').eq('book_id', bookId).order('verified_at', { ascending: false, nullsFirst: false }).limit(1),
    ])
    if (bookRes.error) throw new Error(`Content dates: ${bookRes.error.message}`)
    if (chapterRes.error) throw new Error(`Content dates: ${chapterRes.error.message}`)
    // A syllabus book's practice draws every question in its subject's syllabus chapters
    // (lib/live-counts.ts), so its newest question is the subject's.
    const question = isSyllabusBook(bookId) ? bySubjectId[bookRes.data.subject_id] : await newestQuestion({ source_book_id: bookId })
    const d = latest(question, chapterRes.data[0]?.verified_at)
    if (d) byBookId[bookId] = d
  }))

  return {
    bySubjectCode: Object.fromEntries(subjects.filter((s, i) => s.code && subjectDates[i]).map(s => [s.code!, bySubjectId[s.id]!])),
    byBookId,
  }
}, ['db-content-dates'], { revalidate: 3600 })

// The later of a page's own content date and any database dates, as YYYY-MM-DD.
export function laterDate(...dates: (string | null | undefined)[]): string {
  return latest(...dates.map(d => d?.slice(0, 10)))!
}
