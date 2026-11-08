import { notFound, redirect } from 'next/navigation'
import { getBookBySlug } from '@/lib/books'
import { chapterPageHref } from '@/lib/chapter-pages'
import { hubForExamType } from '@/lib/hub'
import { createServiceClient } from '@/lib/supabase'
import { createAuthClient } from '@/lib/supabase-server'
import StartChapterSession from './StartChapterSession'

// Entry point for "Practise Chapter N" CTAs on public chapter pages. Not a public route:
// proxy.ts sends logged-out visitors to /login?next=<this path>, so they land back here
// after logging in or signing up. Logged-in visitors get a chapter session started
// straight away (StartChapterSession).
export default async function PracticeChapterPage({ params }: { params: Promise<{ book: string; chapter: string }> }) {
  const { book: bookSlug, chapter } = await params
  const bookEntry = getBookBySlug(bookSlug)
  const chapterNumber = Number(chapter)
  if (!bookEntry || !('sourceBookId' in bookEntry) || !Number.isInteger(chapterNumber)) notFound()

  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(`/practice/chapter/${bookSlug}/${chapterNumber}`)}`)

  const supabase = createServiceClient()
  const [{ data: book }, { data: ch }] = await Promise.all([
    supabase.from('source_books').select('id, subject_id, subject:subjects(code)').eq('id', bookEntry.sourceBookId).single(),
    supabase.from('chapters').select('id, chapter_number, chapter_name')
      .eq('book_id', bookEntry.sourceBookId).eq('chapter_number', chapterNumber).single(),
  ])
  if (!book || !ch) notFound()

  const licence = hubForExamType(user.user_metadata?.exam_type as string | undefined).slice(1) // 'cpl' | 'atpl'
  return (
    <StartChapterSession
      subjectId={book.subject_id}
      subjectCode={(book.subject as unknown as { code: string | null } | null)?.code ?? null}
      chapterNumber={ch.chapter_number}
      sourceBookId={book.id}
      chapterId={ch.id}
      licence={licence}
      chapterLabel={`Chapter ${ch.chapter_number}: ${ch.chapter_name}`}
      backHref={`/books/${bookSlug}`}
      sourcePage={chapterPageHref(bookSlug, chapterNumber) ?? `/books/${bookSlug}`}
    />
  )
}
