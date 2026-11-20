import { createServiceClient } from '@/lib/supabase'
import { createAuthClient } from '@/lib/supabase-server'
import { countChapterQuestions } from '@/lib/chapter-question-counts'

// Active questions per chapter of a book, as chapter practice would
// draw them (lib/chapter-question-counts.ts).
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
  const { data: chapters, error: chaptersError } = await supabase.from('chapters').select('id').eq('book_id', bookId)
  if (chaptersError) return Response.json({ error: chaptersError.message }, { status: 500 })

  try {
    const counts = await countChapterQuestions(supabase, {
      subjectId, bookId, chapterIds: (chapters ?? []).map(c => c.id),
    })
    return Response.json({ counts })
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 })
  }
}
