import { BOOKS } from '@/lib/books'

// Chapter taster: a free account gets one 10-question session per chapter, ever, on any
// book with chapter practice. An unfinished taster can be resumed; a new session on the
// same chapter gets the upgrade message. Counted from the sessions table (user +
// chapter_id); no column of its own.
// A session is a taster when it's a chapter session and the student isn't subscribed —
// so a student who later subscribes sees it as an ordinary chapter session.

export const TASTER_QUESTIONS = 10
export const TASTER_USED_ERROR = 'free_tier_chapter_used'

export function isChapterTaster(scope: string, subscribed: boolean): boolean {
  return scope === 'book_chapter' && !subscribed
}

// /practice/chapter/<book>/<n> for a chapter of a book with chapter practice. Sending a
// student whose taster is used back here shows the upgrade message (StartChapterSession).
export function chapterPracticeHref(sourceBookId: string | null, chapterNumber: number | null | undefined): string | null {
  const book = BOOKS.find(b => b.sourceBookId === sourceBookId)
  return book && chapterNumber != null ? `/practice/chapter/${book.slug}/${chapterNumber}` : null
}
