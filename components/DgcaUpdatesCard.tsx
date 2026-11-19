import Link from 'next/link'
import { formatLongDate, todayInIndia } from '@/lib/dgca-exams'
import { dashboardUpdates, EXAM_DATES_PATH } from '@/lib/dgca-updates'

// The CPL dashboard's small DGCA card (above the continue card): the next regular exam
// session, and the new rules' countdown while it applies (lib/dgca-updates.ts). Clicks are
// cta_location "dashboard-updates".
const days = (n: number) => (n === 1 ? '1 day' : `${n} days`)

export default function DgcaUpdatesCard() {
  const { nextExam, rule } = dashboardUpdates(todayInIndia())
  if (!nextExam && !rule) return null
  const link = { color: 'var(--clr-text)', textDecoration: 'none', fontWeight: 600 }
  return (
    <div style={{ border: '1px solid var(--clr-border)', background: 'var(--clr-surf-alt)', borderRadius: 13, padding: '12px 16px', marginBottom: 16, maxWidth: 680, fontSize: 14, lineHeight: 1.5 }}>
      {nextExam && (
        <div>
          <Link href={EXAM_DATES_PATH} data-cta="dashboard-updates" style={link}>
            Next DGCA exam: {nextExam.name}, {nextExam.dates} ({days(nextExam.days)}) →
          </Link>
        </div>
      )}
      {rule && (
        <div style={{ marginTop: nextExam ? 4 : 0 }}>
          <Link href={rule.url} data-cta="dashboard-updates" style={{ ...link, fontWeight: 500, color: 'var(--clr-text-med)' }}>
            New Bharatiya Vayuyan rules from {formatLongDate(rule.date)} ({days(rule.days)}) →
          </Link>
        </div>
      )}
    </div>
  )
}
