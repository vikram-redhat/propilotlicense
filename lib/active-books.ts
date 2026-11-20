import type { SupabaseClient } from '@supabase/supabase-js'
import { isSyllabusBook } from '@/lib/syllabus'

// Books students see: only those with at least one active question to practise, by the rule
// whole-book practice draws on (lib/live-counts.ts bookQuestionTotal): a syllabus book (IC Joshi,
// RK Bali) has questions on its syllabus chapters from any book; any other book, active
// questions that cite it. Used through lib/live-counts.ts activeBooks (the practice picker's
// book list, the licence hub's per-subject book counts, the homepage's source-book count);
// the admin screens still list every book. Needs the service client: students can read only
// the questions in their own sessions.
export async function withActiveQuestions<B extends { id: string }>(supabase: SupabaseClient, books: B[]): Promise<B[]> {
  const syllabus = books.filter(b => isSyllabusBook(b.id)).map(b => b.id)
  const { data: chapters } = syllabus.length
    ? await supabase.from('chapters').select('id, book_id').in('book_id', syllabus)
    : { data: [] as { id: string; book_id: string }[] }
  const has = await Promise.all(books.map(async b => {
    let query = supabase.from('questions').select('id').eq('active', true)
    query = isSyllabusBook(b.id)
      ? query.in('syllabus_chapter_id', (chapters ?? []).filter(c => c.book_id === b.id).map(c => c.id))
      : query.eq('source_book_id', b.id)
    const { data, error } = await query.limit(1)
    // On an error keep the book rather than hide it.
    return !!error || !!data?.length
  }))
  return books.filter((_, i) => has[i])
}
