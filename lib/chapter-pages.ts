// Textbook chapter pages: /books/<book>/<chapter-slug>. A page exists only when an
// editorial content file is registered here — data-only pages for the other chapters
// would be thin, so they are deliberately not generated. To publish another chapter,
// add content/chapters/<book>/<n>.ts and list it below.
import { CHAPTER_2 } from '@/content/chapters/ic-joshi-aviation-meteorology/2'
import { CHAPTER_6 } from '@/content/chapters/ic-joshi-aviation-meteorology/6'
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
  head: string // eyebrow, H1, standfirst, byline
  body: string // editorial body
  faq: string // "Frequently asked questions": <p class="faq-q"> + <p> pairs, also the FAQPage schema
  related: string // "Related chapters" section
  disclaimer: string
}

const PAGES: Record<string, ChapterPageContent[]> = {
  'ic-joshi-aviation-meteorology': [CHAPTER_2, CHAPTER_6, CHAPTER_13],
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

// FAQPage schema entries from the FAQ section's HTML: each <p class="faq-q"> question and
// the <p> after it, as plain text. Built from the visible section so the two can't drift.
export function faqsFromHtml(html: string): { q: string; a: string }[] {
  const text = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&(apos|#39);/g, "'")
    .replace(/\s+/g, ' ').trim()
  return [...html.matchAll(/<p class="faq-q">([\s\S]*?)<\/p>\s*<p>([\s\S]*?)<\/p>/g)]
    .map(m => ({ q: text(m[1]), a: text(m[2]) }))
}
