import LandingHeader from '@/components/LandingHeader'
import SiteFooter from '@/components/SiteFooter'
import { ArticleSchema } from '@/components/schema/ArticleSchema'
import { FAQSchema } from '@/components/schema/FAQSchema'
import { buildMetadata } from '@/lib/metadata'
import { Breadcrumb } from '@/components/guides/ArticleKit'
import { faqsFromHtml } from '@/lib/chapter-pages'
import { getPost } from '@/lib/guides'
import { SUBJECTS } from '@/lib/subjects'
import { questionTotalsOrFallback } from '@/lib/live-counts'
import { dgcaExamGuideUpdatedAt, awaitingResults, escapeHtml, formatLongDate, formatRange, formatShortDate, latestResults, todayInIndia } from '@/lib/dgca-exams'
import { getDgcaResults, getLastChecked } from '@/lib/dgca-results'
import { ARTICLE_HTML } from './articleBody'
import styles from '../dgca-exam-dates/styles.module.css'

const POST = getPost('dgca-exam-guides', 'dgca-exam-results')!
const PATH = '/guides/dgca-exam-guides/dgca-exam-results'

// "Awaiting result" depends on today's date in India, and the subject links carry live
// question counts: re-rendered hourly, and straight away when a result is published or
// hidden (lib/dgca-results.ts). The header corrects its login state client-side.
export const revalidate = 3600

export const metadata = buildMetadata({
  title: POST.metaTitle,
  description: POST.metaDescription,
  path: PATH,
})

const e = escapeHtml

export default async function DgcaExamResultsPage() {
  const today = todayInIndia()
  const [lastChecked, results, totals] = await Promise.all([getLastChecked(), getDgcaResults(), questionTotalsOrFallback()])

  const latest = `  <table class="data-table">
    <thead><tr><th>Session</th><th>Result notice</th></tr></thead>
    <tbody>
${latestResults(results).map(r => `      <tr><td>${e(r.label)}${r.noticeDate ? `, declared ${formatShortDate(r.noticeDate)}` : ''}</td><td><a href="${e(r.url)}">DGCA result notice (PDF)</a></td></tr>`).join('\n')}
    </tbody>
  </table>`

  const awaiting = awaitingResults(today, results)
  const awaitingHtml = awaiting.length
    ? `  <ul>\n${awaiting.map(s => `    <li>Awaiting result: ${e(s.name)} (exams ${formatRange(s.examStart, s.examEnd)})</li>`).join('\n')}\n  </ul>`
    : ''

  // The same counts as /subjects.
  const subjectLinks = `  <ul>\n${SUBJECTS.map(s => {
    const n = totals.bySubject[s.code]
    return `    <li><a href="/subjects/${s.slug}" data-cta="results-page">${e(s.title)}${n != null ? ` (${n.toLocaleString('en-US')} questions)` : ''}</a></li>`
  }).join('\n')}\n  </ul>`

  // The FAQ schema is built from this HTML after it's filled in, so the two always match.
  const html = ARTICLE_HTML
    .replace('{{LAST_CHECKED}}', formatLongDate(lastChecked))
    .replace('{{LATEST_RESULTS}}', latest)
    .replace('{{AWAITING_RESULTS}}', awaitingHtml)
    .replace('{{SUBJECT_LINKS}}', subjectLinks)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <ArticleSchema
        title={POST.title}
        description={POST.metaDescription}
        url={`https://www.propilotlicence.com${PATH}`}
        publishedAt={POST.publishedAt}
        updatedAt={dgcaExamGuideUpdatedAt(POST.updatedAt, lastChecked)}
      />
      <FAQSchema faqs={faqsFromHtml(html)} />
      <LandingHeader isLoggedIn={false} name={null} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 0' }}>
        <Breadcrumb seriesSlug="dgca-exam-guides" seriesLabel="DGCA Exam Guides" current="DGCA exam results" />
      </div>

      <main className={styles.wrap} style={{ paddingTop: 8 }}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </main>

      <SiteFooter />
    </div>
  )
}
