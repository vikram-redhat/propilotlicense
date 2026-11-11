import type { MetadataRoute } from 'next'
import { SUBJECTS } from '@/lib/subjects'
import { BOOKS } from '@/lib/books'
import { GUIDE_SERIES, postHref } from '@/lib/guides'
import { allChapterPages } from '@/lib/chapter-pages'
import { dbContentDates, laterDate, type DbContentDates } from '@/lib/content-dates'

const BASE = 'https://www.propilotlicence.com'

// lastmod is the last real content change, never the build time. Hand-written pages carry
// the date of their last content edit here (from git history); bump it with the edit.
const STATIC_PAGE_UPDATED = {
  home: '2026-11-08',
  about: '2026-11-08',
  subjects: '2026-11-08',
  guides: '2026-07-07', // the hub's own text; its lastmod also follows the sections it lists
  pricing: '2026-07-18',
  privacy: '2026-06-29',
  terms: '2026-06-29',
}

// Refresh hourly so new and reviewed questions and chapter changes reach the subject and
// book dates.
export const revalidate = 3600

const bookIdOf = (b: (typeof BOOKS)[number]) => b.sourceBookId

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // On a database error the subject and book pages fall back to their own content dates.
  let db: DbContentDates = { bySubjectCode: {}, byBookId: {} }
  try {
    db = await dbContentDates(BOOKS.map(bookIdOf))
  } catch (e) {
    console.error(e)
  }

  const chapters = allChapterPages()
  const seriesUpdated = (series: (typeof GUIDE_SERIES)[number]) =>
    laterDate(series.updatedAt, ...series.posts.map(p => p.publishedAt))

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: STATIC_PAGE_UPDATED.home, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/about`, lastModified: STATIC_PAGE_UPDATED.about, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/subjects`, lastModified: STATIC_PAGE_UPDATED.subjects, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/guides`, lastModified: laterDate(STATIC_PAGE_UPDATED.guides, ...GUIDE_SERIES.map(seriesUpdated)), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/pricing`, lastModified: STATIC_PAGE_UPDATED.pricing, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified: STATIC_PAGE_UPDATED.privacy, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: STATIC_PAGE_UPDATED.terms, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const subjectPages: MetadataRoute.Sitemap = SUBJECTS.map((s) => ({
    url: `${BASE}/subjects/${s.slug}`,
    lastModified: laterDate(s.updatedAt, db.bySubjectCode[s.code]),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // A book page lists its chapter pages, so a chapter page edit counts too.
  const bookPages: MetadataRoute.Sitemap = BOOKS.map((b) => ({
    url: `${BASE}/books/${b.slug}`,
    lastModified: laterDate(
      b.updatedAt,
      db.byBookId[bookIdOf(b)],
      ...chapters.filter(c => c.bookSlug === b.slug).map(c => c.page.updatedAt),
    ),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const guideSeriesPages: MetadataRoute.Sitemap = GUIDE_SERIES.map((series) => ({
    url: `${BASE}/guides/${series.slug}`,
    lastModified: seriesUpdated(series),
    changeFrequency: 'weekly' as const,
    priority: 0.72,
  }))

  // The same updatedAt the article's Article schema sends as dateModified.
  const guidePostPages: MetadataRoute.Sitemap = GUIDE_SERIES.flatMap((series) =>
    series.posts.map((post) => ({
      url: `${BASE}${postHref(series, post)}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }))
  )

  // Textbook chapter pages: one per registered editorial content file.
  const chapterPages: MetadataRoute.Sitemap = chapters.map(({ bookSlug, page }) => ({
    url: `${BASE}/books/${bookSlug}/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  return [...staticPages, ...subjectPages, ...bookPages, ...chapterPages, ...guideSeriesPages, ...guidePostPages]
}
