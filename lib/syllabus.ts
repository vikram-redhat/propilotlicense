// Books whose chapter list doubles as the DGCA syllabus map. Every question in the
// subject carries questions.syllabus_chapter_id pointing at one of these chapters (set by
// scripts/classify-syllabus-chapters.mjs), independent of the book it cites.
//
// Chapter practice on these books draws from syllabus_chapter_id — all books' questions
// on that topic — while each question keeps showing its own source citation.
export const SYLLABUS_BOOK_IDS: ReadonlySet<string> = new Set([
  'd05dc941-d49b-4fb3-aab8-a1759e518e8b', // IC Joshi — Aviation Meteorology (2019, Captain Panel verified)
])

export function isSyllabusBook(bookId: string | null | undefined): boolean {
  return !!bookId && SYLLABUS_BOOK_IDS.has(bookId)
}
