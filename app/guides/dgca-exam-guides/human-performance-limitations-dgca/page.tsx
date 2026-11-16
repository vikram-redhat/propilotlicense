import LandingHeader from '@/components/LandingHeader'
import { getHeaderAuthState } from '@/lib/supabase-server'
import SiteFooter from '@/components/SiteFooter'
import { ArticleSchema } from '@/components/schema/ArticleSchema'
import { FAQSchema } from '@/components/schema/FAQSchema'
import { buildMetadata } from '@/lib/metadata'
import { Breadcrumb } from '@/components/guides/ArticleKit'
import { faqsFromHtml } from '@/lib/chapter-pages'
import { getPost } from '@/lib/guides'
import { bookChapterPractice } from '@/lib/live-counts'
import { HUMAN_PERFORMANCE, humanPerformancePracticeHref } from '@/lib/human-performance'
import { ARTICLE_HTML } from './articleBody'
import styles from './styles.module.css'

// Dates come from the guide registry, so the Article schema and the sitemap agree.
const POST = getPost('dgca-exam-guides', 'human-performance-limitations-dgca')!
const PATH = HUMAN_PERFORMANCE.guidePath

// Rendered per request (the header reads the login state). The question count is live, from
// lib/live-counts.ts's hourly cache, which keeps serving the last good value if a refresh fails.
export const metadata = buildMetadata({
  title: POST.metaTitle,
  description: POST.metaDescription,
  path: PATH,
})

export default async function HumanPerformanceGuidePage() {
  const [{ isLoggedIn, name }, chapter] = await Promise.all([
    getHeaderAuthState(),
    bookChapterPractice(HUMAN_PERFORMANCE.bookSlug, HUMAN_PERFORMANCE.chapterId),
  ])
  // The same count and practice link as the subject page. The FAQ schema is built from this
  // HTML after the count is filled in, so the two always match.
  const html = ARTICLE_HTML
    .replace('{{UPDATED}}', new Date(POST.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }))
    .replaceAll('{{HP_QUESTIONS}}', chapter.questions.toLocaleString())
    .replace('{{HP_PRACTICE}}', humanPerformancePracticeHref(chapter.number))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <ArticleSchema
        title={POST.title}
        description={POST.metaDescription}
        url={`https://www.propilotlicence.com${PATH}`}
        publishedAt={POST.publishedAt}
        updatedAt={POST.updatedAt}
      />
      <FAQSchema faqs={faqsFromHtml(html)} />
      <LandingHeader isLoggedIn={isLoggedIn} name={name} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 0' }}>
        <Breadcrumb seriesSlug="dgca-exam-guides" seriesLabel="DGCA Exam Guides" current="Human Performance and Limitations" />
      </div>

      <main className={styles.wrap} style={{ paddingTop: 8 }}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </main>

      <SiteFooter />
    </div>
  )
}
