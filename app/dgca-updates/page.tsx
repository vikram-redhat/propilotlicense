import Link from 'next/link'
import LandingHeader from '@/components/LandingHeader'
import Breadcrumbs from '@/components/Breadcrumbs'
import SiteFooter from '@/components/SiteFooter'
import { buildMetadata } from '@/lib/metadata'
import { DGCA_EXAMS, formatLongDate, formatShortDate, todayInIndia } from '@/lib/dgca-exams'
import { dgcaTimeline, TYPE_LABEL, UPDATES_PATH, type TimelineItem } from '@/lib/dgca-updates'

// The DGCA Updates hub: what's changing at DGCA now, from lib/data/dgca-exam-sessions.json
// (lib/dgca-updates.ts). Which items are coming up and which are past depends on today's date
// in India, so it's re-rendered hourly and rolls over without a deploy. The header corrects
// its login state client-side.
export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'DGCA Updates: Exam Dates, Results and Rule Changes',
  description: "What's changing at DGCA for pilots: upcoming exam sessions, results declared, and the new Bharatiya Vayuyan rules. Checked against DGCA every week.",
  path: UPDATES_PATH,
})

const TYPE_STYLE: Record<TimelineItem['type'], React.CSSProperties> = {
  exam: { background: 'var(--clr-pri-light)', color: 'var(--clr-primary)' },
  result: { background: 'var(--clr-correct-bg)', color: 'var(--clr-correct)' },
  rule: { background: 'var(--clr-amber-light)', color: '#7a5200' },
}

function Item({ item }: { item: TimelineItem }) {
  return (
    <li style={{ display: 'flex', gap: 14, padding: '14px 0', borderTop: '1px solid var(--clr-border)', alignItems: 'flex-start' }}>
      <div style={{ width: 92, flexShrink: 0, fontSize: 13, color: 'var(--clr-text-med)', paddingTop: 2 }}>{formatShortDate(item.date)}</div>
      <div style={{ minWidth: 0 }}>
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', borderRadius: 5, padding: '2px 7px', marginBottom: 4, ...TYPE_STYLE[item.type] }}>
          {TYPE_LABEL[item.type]}
        </span>
        <div>
          <Link href={item.url} style={{ fontSize: 15, fontWeight: 600, color: 'var(--clr-text)', textDecoration: 'none' }}>{item.title} →</Link>
        </div>
        {item.detail && <div style={{ fontSize: 13, color: 'var(--clr-text-med)', marginTop: 2 }}>{item.detail}</div>}
      </div>
    </li>
  )
}

export default function DgcaUpdatesPage() {
  const { coming, recent, earlier } = dgcaTimeline(todayInIndia())
  const h2 = { fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--clr-text)', margin: '36px 0 4px' }
  const list = { listStyle: 'none', padding: 0, margin: 0 }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <LandingHeader isLoggedIn={false} name={null} />

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px 96px' }}>
        <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'DGCA Updates' }]} />

        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 12 }}>
          DGCA Updates
        </h1>
        <p style={{ fontSize: 16, color: 'var(--clr-text-med)', lineHeight: 1.65, marginBottom: 8 }}>
          What&apos;s changing at DGCA for pilots and student pilots: upcoming exam sessions, results as they&apos;re declared, and the move to the new Bharatiya Vayuyan Act and Rules. We check DGCA&apos;s notices every week.
        </p>
        <p style={{ fontSize: 13, color: 'var(--clr-text-med)', marginBottom: 8 }}>
          Last checked against DGCA: {formatLongDate(DGCA_EXAMS.lastCheckedAgainstDGCA)}
        </p>

        <h2 style={h2}>Coming up</h2>
        {coming.length
          ? <ul style={list}>{coming.map((i, k) => <Item key={k} item={i} />)}</ul>
          : <p style={{ fontSize: 14, color: 'var(--clr-text-med)' }}>Nothing announced yet. We add new sessions as soon as DGCA publishes them.</p>}

        <h2 style={h2}>Recent</h2>
        <ul style={list}>{recent.map((i, k) => <Item key={k} item={i} />)}</ul>

        {earlier.length > 0 && (
          <details style={{ marginTop: 24 }}>
            <summary style={{ cursor: 'pointer', fontSize: 15, fontWeight: 600, color: 'var(--clr-primary)' }}>Earlier ({earlier.length})</summary>
            <ul style={{ ...list, marginTop: 8 }}>{earlier.map((i, k) => <Item key={k} item={i} />)}</ul>
          </details>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
