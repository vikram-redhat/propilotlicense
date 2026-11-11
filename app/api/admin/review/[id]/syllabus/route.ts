import { createServiceClient } from '@/lib/supabase'
import { isAdminRequest } from '@/lib/admin-auth'
import { isSyllabusBook, isSyllabusMapBook } from '@/lib/syllabus'

// Set a question's syllabus chapter from the review screen: source 'reviewed',
// confidence 'high'. When the question cites the syllabus book itself and that book's
// syllabus practice is live (IC Joshi), its citation chapter (chapter_id + source_chapter
// text) moves with it, since both describe the same book. RK Bali citations stay as they
// are until Air Regulations syllabus practice is approved. citation_verified is left alone — that's the "Citation correct" box.
// Body { chapterId } → the fields written.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const { chapterId } = await request.json().catch(() => ({}))
  if (!chapterId) return Response.json({ error: 'Missing chapterId' }, { status: 400 })

  const supabase = createServiceClient()
  const [{ data: chapter }, { data: question, error: qError }] = await Promise.all([
    supabase.from('chapters').select('id, book_id, chapter_number, chapter_name').eq('id', chapterId).single(),
    supabase.from('questions').select('id, source_book_id').eq('id', id).single(),
  ])
  if (qError || !question) return Response.json({ error: 'Question not found' }, { status: 404 })
  if (!chapter || !isSyllabusMapBook(chapter.book_id)) {
    return Response.json({ error: 'Not a syllabus chapter' }, { status: 400 })
  }

  const fields: Record<string, string> = {
    syllabus_chapter_id: chapter.id,
    syllabus_chapter_source: 'reviewed',
    syllabus_chapter_confidence: 'high',
  }
  if (question.source_book_id === chapter.book_id && isSyllabusBook(chapter.book_id)) {
    fields.chapter_id = chapter.id
    fields.source_chapter = `Chapter ${chapter.chapter_number}: ${chapter.chapter_name}`
  }

  const { error } = await supabase.from('questions').update(fields).eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true, fields })
}
