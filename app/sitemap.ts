import type { MetadataRoute } from 'next'
import { SUBJECTS } from '@/lib/subjects'
import { BOOKS } from '@/lib/books'
import { GUIDE_SERIES } from '@/lib/guides'

const BASE = 'https://propilotlicence.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/subjects`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const subjectPages: MetadataRoute.Sitemap = SUBJECTS.map((s) => ({
    url: `${BASE}/subjects/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const bookPages: MetadataRoute.Sitemap = BOOKS.map((b) => ({
    url: `${BASE}/books/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const guideSeriesPages: MetadataRoute.Sitemap = GUIDE_SERIES.map((series) => ({
    url: `${BASE}/guides/${series.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.72,
  }))

  const guidePostPages: MetadataRoute.Sitemap = GUIDE_SERIES.flatMap((series) =>
    series.posts.map((post) => ({
      url: `${BASE}/guides/${series.slug}/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }))
  )

  return [...staticPages, ...subjectPages, ...bookPages, ...guideSeriesPages, ...guidePostPages]
}
