import LandingHeader from '@/components/LandingHeader'
import { getHeaderAuthState } from '@/lib/supabase-server'
import SiteFooter from '@/components/SiteFooter'
import { ArticleSchema } from '@/components/schema/ArticleSchema'
import { FAQSchema } from '@/components/schema/FAQSchema'
import { buildMetadata } from '@/lib/metadata'
import { Breadcrumb } from '@/components/guides/ArticleKit'
import { faqsFromHtml } from '@/lib/chapter-pages'
import { getPost } from '@/lib/guides'
import { newRulesQuestionCount } from '@/lib/live-counts'
import { newRulesHref } from '@/lib/new-rules'
import { newRulesQuiz } from '@/lib/new-rules-quiz'
import NewRulesQuiz from '@/components/guides/NewRulesQuiz'
import { ARTICLE_HTML } from './articleBody'
import styles from './styles.module.css'

// Dates come from the guide registry, so the Article schema and the sitemap agree.
const POST = getPost('dgca-exam-guides', 'bharatiya-vayuyan-niyam-2026')!
const PATH = '/guides/dgca-exam-guides/bharatiya-vayuyan-niyam-2026'
const H1 = 'Bharatiya Vayuyan Niyam 2026: What Pilots and DGCA Students Need to Know'

export const metadata = buildMetadata({
  title: POST.metaTitle,
  description: POST.metaDescription,
  path: PATH,
})

// The visible "Updated" date in the byline is generated from updatedAt.
const baseHtml = ARTICLE_HTML.replace('{{UPDATED}}',
  new Date(POST.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }))
const QUIZ_MARKER = '<!--NEW_RULES_QUIZ-->'

export default async function BharatiyaVayuyanNiyamPage() {
  const [{ isLoggedIn, name }, quiz, count] = await Promise.all([
    getHeaderAuthState(),
    newRulesQuiz(),
    newRulesQuestionCount().catch(() => null),
  ])
  // The bottom CTA and the quiz's end link go into the new-rules set (through signup when
  // logged out); the quiz renders at QUIZ_MARKER, or not at all if its questions can't be read.
  const ctaHref = newRulesHref(isLoggedIn)
  const html = baseHtml
    .replace('{{NEW_RULES_HREF}}', ctaHref)
    .replace('{{NEW_RULES_COUNT}} ', count ? `${count} ` : '')
  const [before, after] = html.split(QUIZ_MARKER)
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <ArticleSchema
        title={H1}
        description={POST.metaDescription}
        url={`https://www.propilotlicence.com${PATH}`}
        publishedAt={POST.publishedAt}
        updatedAt={POST.updatedAt}
        about={{ '@type': 'Legislation', name: 'Bharatiya Vayuyan Niyam, 2026' }}
      />
      {/* Built from the visible FAQ section, so the schema can't drift from the page. */}
      <FAQSchema faqs={faqsFromHtml(html)} />
      <LandingHeader isLoggedIn={isLoggedIn} name={name} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 0' }}>
        <Breadcrumb seriesSlug="dgca-exam-guides" seriesLabel="DGCA Exam Guides" current="Bharatiya Vayuyan Niyam 2026" />
      </div>

      <main className={styles.wrap} style={{ paddingTop: 8 }}>
        <div dangerouslySetInnerHTML={{ __html: before }} />
        {quiz && <NewRulesQuiz quiz="niyam" questions={quiz} ctaHref={ctaHref} isLoggedIn={isLoggedIn} />}
        <div dangerouslySetInnerHTML={{ __html: after ?? '' }} />
      </main>

      <SiteFooter />
    </div>
  )
}
