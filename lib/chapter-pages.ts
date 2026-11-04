// Textbook chapter pages: /books/<book>/<chapter-slug>. A page exists only when an
// editorial content file is registered here — data-only pages for the other chapters
// would be thin, so they are deliberately not generated. To publish another chapter,
// add content/chapters/<book>/<n>.ts and list it below.
import { CHAPTER_13 } from '@/content/chapters/ic-joshi-aviation-meteorology/13'

export interface ChapterPageContent {
  chapterNumber: number
  slug: string // "chapter-<n>-<slugified name>"
  metaTitle: string // no "| ProPilotLicence" suffix
  metaDescription: string
  excerpt: string
  publishedAt: string
  updatedAt: string
  reviewedBy: string
  sampleQuestionIds: string[] // fixed, so the page is stable between renders
  faqs: { q: string; a: string }[] // rendered visibly and as FAQPage schema
  head: string // eyebrow, H1, standfirst, byline
  body: string // editorial body
  related: string // "Related chapters" section
  disclaimer: string
}

const PAGES: Record<string, ChapterPageContent[]> = {
  'ic-joshi-aviation-meteorology': [CHAPTER_13],
}

export function chapterPagesForBook(bookSlug: string): ChapterPageContent[] {
  return PAGES[bookSlug] ?? []
}

export function getChapterPage(bookSlug: string, chapterSlug: string): ChapterPageContent | undefined {
  return chapterPagesForBook(bookSlug).find(p => p.slug === chapterSlug)
}

export function chapterPageHref(bookSlug: string, chapterNumber: number): string | null {
  const page = chapterPagesForBook(bookSlug).find(p => p.chapterNumber === chapterNumber)
  return page ? `/books/${bookSlug}/${page.slug}` : null
}

export function allChapterPages(): { bookSlug: string; page: ChapterPageContent }[] {
  return Object.entries(PAGES).flatMap(([bookSlug, pages]) => pages.map(page => ({ bookSlug, page })))
}

// Editorial content links to other chapters as <a href="#">Chapter 9, …</a>. Point each
// at its page if one exists; otherwise unwrap it to plain text so there are no dead links.
export function resolveChapterLinks(html: string, bookSlug: string): string {
  return html.replace(/<a href="#">(Chapter (\d+)\b[^<]*)<\/a>/g, (_, text: string, n: string) => {
    const href = chapterPageHref(bookSlug, Number(n))
    return href ? `<a href="${href}">${text}</a>` : text
  })
}
