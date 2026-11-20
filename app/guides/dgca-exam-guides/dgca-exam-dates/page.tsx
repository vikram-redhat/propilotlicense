import LandingHeader from '@/components/LandingHeader'
import SiteFooter from '@/components/SiteFooter'
import { ArticleSchema } from '@/components/schema/ArticleSchema'
import { FAQSchema } from '@/components/schema/FAQSchema'
import { buildMetadata } from '@/lib/metadata'
import { Breadcrumb } from '@/components/guides/ArticleKit'
import { faqsFromHtml } from '@/lib/chapter-pages'
import { getPost } from '@/lib/guides'
import {
  DGCA_EXAMS, dgcaExamGuideUpdatedAt, SESSION_TYPE_LABEL, calendarYears, escapeHtml, formatLongDate, formatRange, formatRangeLong,
  portalStatus, sessionById, sessionsInYear, todayInIndia, upcomingSessions, type ExamSession,
} from '@/lib/dgca-exams'
import { getLastChecked } from '@/lib/dgca-results'
import { ARTICLE_HTML } from './articleBody'
import styles from './styles.module.css'

const POST = getPost('dgca-exam-guides', 'dgca-exam-dates')!
const PATH = '/guides/dgca-exam-guides/dgca-exam-dates'

// Next exams and portal statuses depend on today's date in India. Re-rendered hourly, so they
// roll over within an hour of midnight IST without a deploy; the header corrects its login
// state client-side.
export const revalidate = 3600

export const metadata = buildMetadata({
  title: POST.metaTitle,
  description: POST.metaDescription,
  path: PATH,
})

const e = escapeHtml

function sessionsTable(rows: ExamSession[], last: { head: string; cell: (s: ExamSession) => string }): string {
  return `  <table class="data-table">
    <thead><tr><th>Session</th><th>Type</th><th>Exam dates</th><th>${last.head}</th></tr></thead>
    <tbody>
${rows.map(s => `      <tr><td>${e(s.name)}</td><td>${SESSION_TYPE_LABEL[s.type]}</td><td class="mono">${formatRange(s.examStart, s.examEnd)}</td><td>${e(last.cell(s))}</td></tr>`).join('\n')}
    </tbody>
  </table>`
}

function calendarRegion(year: number, url: string | null, today: string): string {
  const table = sessionsTable(sessionsInYear(year), { head: 'Status', cell: s => (s.examEnd < today ? 'Completed' : 'Upcoming') })
  return url ? `${table}\n  <p><a href="${e(url)}">DGCA's ${year} exam calendar (PDF)</a></p>` : table
}

export default async function DgcaExamDatesPage() {
  const today = todayInIndia()
  const lastChecked = await getLastChecked()

  const nextExams = sessionsTable(upcomingSessions(today).slice(0, 4), { head: 'Portal', cell: s => portalStatus(s, today) })

  // One row per city, centres in the order DGCA lists them.
  const byCity = new Map<string, string[]>()
  for (const c of DGCA_EXAMS.venues.centres) byCity.set(c.city, [...(byCity.get(c.city) ?? []), c.centre])
  const venueSession = sessionById(DGCA_EXAMS.venues.session)?.name ?? DGCA_EXAMS.venues.session
  const venues = `  <table class="data-table">
    <thead><tr><th>City</th><th>Centre</th></tr></thead>
    <tbody>
${[...byCity].sort(([a], [b]) => a.localeCompare(b)).map(([city, centres]) => `      <tr><td>${e(city)}</td><td>${e(centres.join('; '))}</td></tr>`).join('\n')}
    </tbody>
  </table>
  <p><a href="${e(DGCA_EXAMS.venues.url)}">DGCA's venue list for ${e(venueSession)} (PDF)</a></p>`

  const { current, next, nextYear } = calendarYears(today)
  const calYear = current?.year ?? Number(today.slice(0, 4))
  const calendarNextYear = next
    ? `  <h2>DGCA exam calendar ${next.year}</h2>\n${calendarRegion(next.year, next.url, today)}`
    : `  <h2>DGCA exam calendar ${nextYear}</h2>\n  <p>DGCA hasn't published the ${nextYear} calendar yet. It usually appears around the turn of the year. We check DGCA's notice board every week and will add it here the day it's out.</p>`

  // The first FAQ answer names the next regular session. The FAQ schema is built from this
  // HTML after it's filled in, so the visible answer and the schema always match.
  const regular = upcomingSessions(today, 'regular')[0]
  const nextRegular = regular
    ? `The next DGCA CPL and ATPL theory exams are ${e(regular.name)}, from ${formatRangeLong(regular.examStart, regular.examEnd)}.`
    : `The next regular session will be listed here once DGCA publishes its ${nextYear} calendar.`

  const html = ARTICLE_HTML
    .replace('{{LAST_CHECKED}}', formatLongDate(lastChecked))
    .replace('{{NEXT_EXAMS}}', nextExams)
    .replace('{{VENUE_SESSION}}', e(venueSession))
    .replace('{{VENUES}}', venues)
    .replaceAll('{{CAL_YEAR}}', String(calYear))
    .replace('{{CALENDAR}}', calendarRegion(calYear, current?.url ?? null, today))
    .replace('{{CALENDAR_NEXT_YEAR}}', calendarNextYear)
    .replace('{{NEXT_REGULAR}}', nextRegular)

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
        <Breadcrumb seriesSlug="dgca-exam-guides" seriesLabel="DGCA Exam Guides" current="DGCA exam dates" />
      </div>

      <main className={styles.wrap} style={{ paddingTop: 8 }}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </main>

      <SiteFooter />
    </div>
  )
}
