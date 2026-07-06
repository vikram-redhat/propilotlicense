import type { MetadataRoute } from 'next'
import { SUBJECTS } from '@/lib/subjects'
import { BOOKS } from '@/lib/books'
import { BLOG_POSTS } from '@/lib/blog-posts'
import { BECOME_A_PILOT_POSTS } from '@/lib/become-a-pilot'

const BASE = 'https://propilotlicence.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/subjects`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/become-a-pilot`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
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

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const becomeAPilotPages: MetadataRoute.Sitemap = BECOME_A_PILOT_POSTS.map((p) => ({
    url: `${BASE}/become-a-pilot/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  return [...staticPages, ...subjectPages, ...bookPages, ...blogPages, ...becomeAPilotPages]
}
