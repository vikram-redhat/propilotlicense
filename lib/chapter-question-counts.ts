import type { SupabaseClient } from '@supabase/supabase-js'
import { isVisibleForCountry } from '@/lib/countries'
import { chapterColumnFor } from '@/lib/syllabus'

// Active questions per chapter of a book, as chapter practice draws them: the column
// from chapterColumnFor (syllabus chapter for IC Joshi, the book's own chapter otherwise)
// and the same country rule as /api/session/start. Used by the practice picker
// (/api/session/chapter-counts) and the public chapter pages, so they always agree.
// Pass a service-role client. Throws on a database error.
export async function countChapterQuestions(
  supabase: SupabaseClient,
  { subjectId, bookId, chapterIds, country }: { subjectId: string; bookId: string; chapterIds: string[]; country: string | null },
): Promise<Record<string, number>> {
  const counts: Record<string, number> = Object.fromEntries(chapterIds.map(id => [id, 0]))
  if (!chapterIds.length) return counts

  const fetchRows = async (column: 'syllabus_chapter_id' | 'chapter_id') => {
    const rows: { source_book_id: string | null; chapter: string | null }[] = []
    for (let from = 0; ; from += 1000) {
      let query = supabase
        .from('questions')
        .select(`id, source_book_id, chapter:${column}`)
        .eq('subject_id', subjectId)
        .eq('active', true)
        .in(column, chapterIds)
      if (column === 'chapter_id') query = query.eq('source_book_id', bookId)
      const { data, error } = await query.order('id').range(from, from + 999)
      if (error) return { rows, error }
      rows.push(...(data as unknown as typeof rows))
      if (data.length < 1000) return { rows, error: null }
    }
  }

  let { rows, error } = await fetchRows(chapterColumnFor(bookId))
  // 42703 = undefined column: syllabus migration not run — same fallback as session start.
  if (error?.code === '42703') ({ rows, error } = await fetchRows('chapter_id'))
  if (error) throw new Error(`Chapter question counts: ${error.message}`)

  const bookIds = [...new Set(rows.map(r => r.source_book_id).filter(Boolean))] as string[]
  const { data: books, error: booksError } = bookIds.length
    ? await supabase.from('source_books').select('id, countries').in('id', bookIds)
    : { data: [] as { id: string; countries: string[] | null }[], error: null }
  if (booksError) throw new Error(`Chapter question counts: ${booksError.message}`)
  const countriesByBook = new Map((books ?? []).map(b => [b.id, b.countries]))

  for (const r of rows) {
    const countries = r.source_book_id ? countriesByBook.get(r.source_book_id) : undefined
    if (r.chapter && isVisibleForCountry(countries, country)) counts[r.chapter]++
  }
  return counts
}
