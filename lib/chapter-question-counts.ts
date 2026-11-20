import type { SupabaseClient } from '@supabase/supabase-js'
import { chapterColumnFor } from '@/lib/syllabus'

// Active questions per chapter of a book, as chapter practice draws them: the column
// from chapterColumnFor (syllabus chapter for IC Joshi and RK Bali, the book's own chapter otherwise)
// and every active book, as /api/session/start (no country filter since 20 Nov 2026). Used by the practice picker
// (/api/session/chapter-counts) and the public chapter pages, so they always agree.
// Pass a service-role client. Throws on a database error.
export async function countChapterQuestions(
  supabase: SupabaseClient,
  { subjectId, bookId, chapterIds }: { subjectId: string; bookId: string; chapterIds: string[] },
): Promise<Record<string, number>> {
  const counts: Record<string, number> = Object.fromEntries(chapterIds.map(id => [id, 0]))
  if (!chapterIds.length) return counts

  const fetchRows = async (column: 'syllabus_chapter_id' | 'chapter_id') => {
    const rows: { chapter: string | null }[] = []
    for (let from = 0; ; from += 1000) {
      let query = supabase
        .from('questions')
        .select(`id, chapter:${column}`)
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

  for (const r of rows) if (r.chapter) counts[r.chapter]++
  return counts
}
