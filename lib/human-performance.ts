// Human Performance and Limitations: a chapter of RK Bali's Air Regulations (examined in the
// Air Regulations paper), with its own subject page and guide. The chapter is identified by
// its record, not its number: numbers change when the book's chapters are corrected (it
// moved from 22 to 23 on 2026-11-16), so pages read the current number from the database
// (bookChapterPractice in lib/live-counts.ts).
export const HUMAN_PERFORMANCE = {
  bookSlug: 'rk-bali-air-regulations',
  chapterId: '6f00dd46-63a4-4027-884d-148b2bb8575f',
  subjectPath: '/subjects/human-performance',
  guidePath: '/guides/dgca-exam-guides/human-performance-limitations-dgca',
} as const

// Chapter practice for its current number (20 questions; the free taster rules apply).
export function humanPerformancePracticeHref(chapterNumber: number): string {
  return `/practice/chapter/${HUMAN_PERFORMANCE.bookSlug}/${chapterNumber}`
}

// Book chapters that have a page of their own, by chapter record (the book page links them).
export function chapterOwnPage(chapterId: string): string | null {
  return chapterId === HUMAN_PERFORMANCE.chapterId ? HUMAN_PERFORMANCE.subjectPath : null
}
