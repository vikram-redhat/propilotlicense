import { isSyllabusBook } from '@/lib/syllabus'

// Which chapter record a citation shows. For the syllabus books (IC Joshi 2019, RK Bali 2018)
// it's the question's syllabus chapter, in that edition's numbering and name, rather than the
// older chapter link or the text it was first saved with; for other books, the chapter link.
// Callers fall back to source_chapter text when this is null.
export function citationChapterId(q: { source_book_id?: string | null; syllabus_chapter_id?: string | null; chapter_id?: string | null }): string | null {
  if (isSyllabusBook(q.source_book_id) && q.syllabus_chapter_id) return q.syllabus_chapter_id
  return q.chapter_id ?? null
}

// The citation line under an answer: book (and author), then chapter, then page.
// - The page only when the citation is verified (checked against the book): an unverified
//   page was the AI's estimate, so it isn't shown, and nothing is labelled "(approx.)".
// - No book, no citation line (callers render nothing when this returns null).
// Used by the session page, the results page and the chapter pages' sample questions.
export function citationLine({ book, chapterLabel, page, verified, withEdition = false }: {
  book: { title: string; author?: string | null; edition?: string | null } | null | undefined
  chapterLabel: string | null | undefined
  page: string | null | undefined
  verified: boolean | null | undefined
  withEdition?: boolean
}): string | null {
  if (!book) return null
  return [
    `${book.title}${book.author ? ` — ${book.author}` : ''}`,
    withEdition ? book.edition : null,
    chapterLabel,
    verified ? page : null,
  ].filter(Boolean).join(' · ')
}
