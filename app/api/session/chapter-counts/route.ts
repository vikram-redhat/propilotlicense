import { createServiceClient } from '@/lib/supabase'
import { createAuthClient } from '@/lib/supabase-server'
import { isVisibleForCountry } from '@/lib/countries'
import { chapterColumnFor } from '@/lib/syllabus'

// Active questions per chapter of a book, as chapter practice would draw them for this
// student: same column (lib/syllabus.ts) and same country rule as /api/session/start.
// GET ?subjectId=…&bookId=… → { counts: { [chapterId]: number } }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const subjectId = searchParams.get('subjectId')
  const bookId = searchParams.get('bookId')
  if (!subjectId || !bookId) return Response.json({ error: 'Missing subjectId or bookId' }, { status: 400 })

  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const [{ data: profile }, { data: chapters, error: chaptersError }] = await Promise.all([
    supabase.from('profiles').select('country').eq('id', user.id).single(),
    supabase.from('chapters').select('id').eq('book_id', bookId),
  ])
  if (chaptersError) return Response.json({ error: chaptersError.message }, { status: 500 })
  const chapterIds = (chapters ?? []).map(c => c.id)
  if (!chapterIds.length) return Response.json({ counts: {} })

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
  if (error) return Response.json({ error: error.message }, { status: 500 })

  const bookIds = [...new Set(rows.map(r => r.source_book_id).filter(Boolean))] as string[]
  const { data: books } = bookIds.length
    ? await supabase.from('source_books').select('id, countries').in('id', bookIds)
    : { data: [] as { id: string; countries: string[] | null }[] }
  const countriesByBook = new Map((books ?? []).map(b => [b.id, b.countries]))

  const counts: Record<string, number> = Object.fromEntries(chapterIds.map(id => [id, 0]))
  for (const r of rows) {
    const countries = r.source_book_id ? countriesByBook.get(r.source_book_id) : undefined
    if (r.chapter && isVisibleForCountry(countries, profile?.country ?? null)) counts[r.chapter]++
  }
  return Response.json({ counts })
}
