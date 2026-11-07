import { unstable_cache } from 'next/cache'
import { getBookBySlug } from '@/lib/books'
import { chapterPageHref } from '@/lib/chapter-pages'
import { countChapterQuestions } from '@/lib/chapter-question-counts'
import { createServiceClient } from '@/lib/supabase'

export const BOOK_SLUG = 'ic-joshi-aviation-meteorology'

export type SyllabusChapter = {
  number: number
  name: string
  weight: 'High' | 'Medium' | 'Low' | null
  topics: string | null
  questions: number
  href: string | null
}

// The IC Joshi 2019 chapters (the syllabus map) with the Captain Panel's exam_weight,
// syllabus topics and live question counts (the practice picker's rule). Every tier list,
// "highest-yield" claim and chapter table on the site renders from this, so none can drift
// from the book page and chapter pages. Cached for an hour; a failed refresh serves the
// last good value. Throws only with nothing cached and the database down.
export const loadIcJoshiSyllabus = unstable_cache(async (): Promise<SyllabusChapter[]> => {
  const entry = getBookBySlug(BOOK_SLUG)
  if (!entry || !('sourceBookId' in entry)) throw new Error('IC Joshi book entry missing')
  const supabase = createServiceClient()
  const [bookRes, chaptersRes] = await Promise.all([
    supabase.from('source_books').select('id, subject_id').eq('id', entry.sourceBookId).single(),
    supabase.from('chapters').select('id, chapter_number, chapter_name, exam_weight, syllabus_topics')
      .eq('book_id', entry.sourceBookId).order('chapter_number'),
  ])
  if (bookRes.error) throw new Error(`IC Joshi syllabus: ${bookRes.error.message}`)
  if (chaptersRes.error) throw new Error(`IC Joshi syllabus: ${chaptersRes.error.message}`)
  const counts = await countChapterQuestions(supabase, {
    subjectId: bookRes.data.subject_id, bookId: bookRes.data.id,
    chapterIds: chaptersRes.data.map(c => c.id), country: 'IN',
  })
  return chaptersRes.data.map(c => ({
    number: c.chapter_number,
    name: c.chapter_name,
    weight: c.exam_weight ?? null,
    topics: c.syllabus_topics ?? null,
    questions: counts[c.id] ?? 0,
    href: chapterPageHref(BOOK_SLUG, c.chapter_number),
  }))
}, ['ic-joshi-syllabus'], { revalidate: 3600 })

// "1 to 7, 13 and 21": runs of three or more collapse to "a to b".
export function chapterList(numbers: number[]): string {
  const parts: string[] = []
  for (let i = 0; i < numbers.length;) {
    let j = i
    while (j + 1 < numbers.length && numbers[j + 1] === numbers[j] + 1) j++
    if (j - i >= 2) parts.push(`${numbers[i]} to ${numbers[j]}`)
    else for (let k = i; k <= j; k++) parts.push(String(numbers[k]))
    i = j + 1
  }
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0] ?? ''
}

// "10 (Optical Phenomenon), 17 (Mountain Waves) and 22 (…)"
export function namedChapterList(chapters: SyllabusChapter[]): string {
  const parts = chapters.map(c => `${c.number} (${c.name})`)
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0] ?? ''
}
