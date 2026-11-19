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
