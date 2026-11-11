// Books whose chapter list doubles as a subject's DGCA syllabus map. Every question in
// the subject carries questions.syllabus_chapter_id pointing at one of these chapters (set
// by scripts/classify-syllabus-chapters.mjs for Meteorology and
// scripts/classify-air-regs-chapters.mjs for Air Regulations), independent of the book it
// cites. Used by the classifiers and the review screen's syllabus dropdown and filter.
export const SYLLABUS_MAP_BOOK_IDS: ReadonlySet<string> = new Set([
  'd05dc941-d49b-4fb3-aab8-a1759e518e8b', // IC Joshi — Aviation Meteorology (2019, Captain Panel verified)
  '15db3a2f-0718-4f98-beeb-177d9b92a4a4', // RK Bali — Air Regulations (2018, Captain Panel verified)
])

export function isSyllabusMapBook(bookId: string | null | undefined): boolean {
  return !!bookId && SYLLABUS_MAP_BOOK_IDS.has(bookId)
}

// The syllabus-map books whose practice is live for students. Chapter practice on these
// draws from syllabus_chapter_id — all books' questions on that topic — while each
// question keeps showing its own source citation; their practice counts and book totals
// follow the same rule. A map book joins this list once its subject's full
// classification run is approved (RK Bali: not yet).
export const SYLLABUS_BOOK_IDS: ReadonlySet<string> = new Set([
  'd05dc941-d49b-4fb3-aab8-a1759e518e8b', // IC Joshi — Aviation Meteorology
])

export function isSyllabusBook(bookId: string | null | undefined): boolean {
  return !!bookId && SYLLABUS_BOOK_IDS.has(bookId)
}

// Which questions column chapter practice filters on for a book. Shared by
// /api/session/start (the pool) and /api/session/chapter-counts (the picker's counts)
// so the two always agree.
export function chapterColumnFor(bookId: string | null | undefined): 'syllabus_chapter_id' | 'chapter_id' {
  return isSyllabusBook(bookId) ? 'syllabus_chapter_id' : 'chapter_id'
}
