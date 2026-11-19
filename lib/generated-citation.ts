import { isSyllabusBook } from '@/lib/syllabus'

// Where a question made with the admin Generate tool is filed. The model returns its citation
// as text ("Chapter 18", "Page 312"); this turns it into chapter records:
// - the chapter: the one chosen in the form, or, when generating for the whole book, the
//   book's chapter with the number the model gave;
// - chapter_id (the citation) is that chapter; for a syllabus book (IC Joshi, RK Bali) it is
//   also the syllabus chapter, marked 'rule' with medium confidence (the model sometimes
//   writes a question that belongs to another chapter, so it stays open to review);
// - the page is kept only if it falls inside the chapter's page range (chapters.page_start
//   to page_end); with no range on record, or no chapter, it's left blank.
// Without a book the model's text is kept as it was.
export type CitationChapter = { id: string; chapter_number: number; page_start?: number | null; page_end?: number | null }

export function generatedCitation({ bookId, chapters, chosenChapterId, sourceChapter, sourcePage }: {
  bookId: string | null
  chapters: CitationChapter[]
  chosenChapterId: string | null
  sourceChapter: string | null | undefined
  sourcePage: string | null | undefined
}) {
  if (!bookId) return { source_chapter: sourceChapter || null, source_page: sourcePage || null }

  const number = Number(String(sourceChapter ?? '').match(/\d+/)?.[0])
  const chapter = chosenChapterId
    ? chapters.find(c => c.id === chosenChapterId) ?? null
    : chapters.find(c => c.chapter_number === number) ?? null
  if (!chapter) return { source_chapter: sourceChapter || null, source_page: null, chapter_id: null }

  const page = Number(String(sourcePage ?? '').match(/\d+/)?.[0])
  const inRange = chapter.page_start != null && chapter.page_end != null && page >= chapter.page_start && page <= chapter.page_end
  return {
    chapter_id: chapter.id,
    source_chapter: `Chapter ${chapter.chapter_number}`,
    source_page: inRange ? `Page ${page}` : null,
    ...(isSyllabusBook(bookId)
      ? { syllabus_chapter_id: chapter.id, syllabus_chapter_source: 'rule', syllabus_chapter_confidence: 'medium' }
      : {}),
  }
}
