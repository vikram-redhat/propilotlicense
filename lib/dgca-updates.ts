import {
  DGCA_EXAMS, formatRange, formatShortDate, portalStatus, sessionById, type ExamSession,
} from '@/lib/dgca-exams'

// What's changing at DGCA, for the DGCA Updates hub (/dgca-updates), the updates bar under the
// header (components/UpdatesBar.tsx) and the dashboard card. Built from three parts of
// lib/data/dgca-exam-sessions.json: the CPL/ATPL sessions (regular and OLODE; FIR/AFIR orals
// and FATA are left out), their result notices, and the dated rule changes in `updates`.
// Every rule here takes today's date in India (YYYY-MM-DD, lib/dgca-exams.ts todayInIndia).

export const EXAM_DATES_PATH = '/guides/dgca-exam-guides/dgca-exam-dates'
export const EXAM_RESULTS_PATH = '/guides/dgca-exam-guides/dgca-exam-results'
export const UPDATES_PATH = '/dgca-updates'

const PILOT_EXAMS: ReadonlySet<string> = new Set(['regular', 'olode'])
const pilotSessions = () => DGCA_EXAMS.sessions.filter(s => PILOT_EXAMS.has(s.type))
const pilotResults = () => DGCA_EXAMS.results.filter(r => PILOT_EXAMS.has(sessionById(r.session)?.type ?? ''))

// Whole days from a to b (both YYYY-MM-DD).
export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 864e5)
}

// "Regular Session 04 of 2026" -> "Regular Session 04"
export function shortSessionName(s: ExamSession): string {
  return s.name.replace(/ of \d{4}$/, '')
}

// "18–20 Nov" (no year), for the bar and the card
function rangeNoYear(s: ExamSession): string {
  return formatRange(s.examStart, s.examEnd).replace(/ \d{4}$/, '').replace(/ \d{4} – /, ' – ')
}

// ── Hub timeline ─────────────────────────────────────────────────────────────

export type TimelineItem = {
  date: string // when it happens (an exam session's first day)
  type: 'exam' | 'result' | 'rule'
  title: string
  url: string
  detail?: string // exam dates, portal status, or days to go
}

export const TYPE_LABEL: Record<TimelineItem['type'], string> = { exam: 'Exam', result: 'Result', rule: 'Rule change' }

// Coming up (soonest first, sessions still under way included) and past items (newest first),
// split into the last 12 months and earlier.
export function dgcaTimeline(today: string) {
  const coming: TimelineItem[] = []
  const past: TimelineItem[] = []
  for (const s of pilotSessions()) {
    const item: TimelineItem = { date: s.examStart, type: 'exam', title: s.name, url: EXAM_DATES_PATH, detail: `Exams ${formatRange(s.examStart, s.examEnd)}` }
    if (s.examEnd >= today) {
      const under = s.examStart <= today
      coming.push({ ...item, detail: `${item.detail} · ${under ? 'under way' : `Portal: ${portalStatus(s, today)}`}` })
    } else past.push({ ...item, title: `${s.name} held` })
  }
  for (const r of pilotResults()) {
    const date = r.noticeDate ?? r.seenOn
    ;(date > today ? coming : past).push({ date, type: 'result', title: `Results declared: ${r.label}`, url: EXAM_RESULTS_PATH })
  }
  for (const u of DGCA_EXAMS.updates) {
    if (u.date > today) coming.push({ date: u.date, type: 'rule', title: u.title, url: u.url, detail: u.countdown ? daysToGo(daysBetween(today, u.date)) : undefined })
    else past.push({ date: u.date, type: 'rule', title: u.title, url: u.url })
  }
  coming.sort((a, b) => a.date.localeCompare(b.date))
  past.sort((a, b) => b.date.localeCompare(a.date))
  const yearAgo = `${Number(today.slice(0, 4)) - 1}${today.slice(4)}`
  return { coming, recent: past.filter(i => i.date > yearAgo), earlier: past.filter(i => i.date <= yearAgo) }
}

function daysToGo(n: number): string {
  return n === 1 ? '1 day to go' : `${n} days to go`
}

// ── Updates bar: the first rule that applies ─────────────────────────────────

export type BarMessage = { rule: 1 | 2 | 3 | 4 | 5; text: string; href: string }

export function updatesBarMessage(today: string): BarMessage | null {
  // 1. A result declared in the last 7 days
  const result = pilotResults()
    .map(r => ({ r, date: r.noticeDate ?? r.seenOn }))
    .filter(({ date }) => date <= today && daysBetween(date, today) <= 7)
    .sort((a, b) => b.date.localeCompare(a.date))[0]
  if (result) {
    const s = sessionById(result.r.session)
    return { rule: 1, text: `Results declared: ${s?.name ?? result.r.label}. Check yours →`, href: EXAM_RESULTS_PATH }
  }
  // 2. A portal open now and closing within 14 days
  const portal = pilotSessions()
    .filter(s => s.portalOpen && s.portalClose && s.portalOpen <= today && today <= s.portalClose && daysBetween(today, s.portalClose) <= 14)
    .sort((a, b) => a.portalClose!.localeCompare(b.portalClose!))[0]
  if (portal) return { rule: 2, text: `Pariksha portal open until ${formatShortDate(portal.portalClose!, false)} for ${shortSessionName(portal)} →`, href: EXAM_DATES_PATH }
  // 3. A session under way, or starting within 7 days
  const soon = pilotSessions().find(s => s.examStart <= today && today <= s.examEnd)
    ?? pilotSessions().find(s => s.examStart > today && daysBetween(today, s.examStart) <= 7)
  if (soon) {
    const days = daysBetween(today, soon.examStart)
    const when = days <= 0 ? 'is under way' : days === 1 ? 'starts tomorrow' : `starts in ${days} days`
    return { rule: 3, text: `${shortSessionName(soon)} ${when} (${rangeNoYear(soon)}) →`, href: EXAM_DATES_PATH }
  }
  // 4. A rule change still to come, with a countdown
  const rule = DGCA_EXAMS.updates.find(u => u.countdown && u.date > today)
  if (rule) {
    const n = daysBetween(today, rule.date)
    return { rule: 4, text: `New aviation rules take effect in ${n === 1 ? '1 day' : `${n} days`}: what changes for pilots →`, href: rule.url }
  }
  // 5. The next regular session
  const next = pilotSessions().find(s => s.type === 'regular' && s.examStart > today)
  if (next) return { rule: 5, text: `Next DGCA exam: ${shortSessionName(next)}, ${rangeNoYear(next)} →`, href: EXAM_DATES_PATH }
  return null
}

// ── Dashboard card ───────────────────────────────────────────────────────────

export function dashboardUpdates(today: string) {
  const next = pilotSessions().find(s => s.type === 'regular' && s.examStart > today) ?? null
  const rule = DGCA_EXAMS.updates.find(u => u.countdown && u.date > today) ?? null
  return {
    nextExam: next && {
      name: shortSessionName(next),
      dates: formatRange(next.examStart, next.examEnd).replace(/ \d{4}$/, '').replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, m => LONG[m]),
      days: daysBetween(today, next.examStart),
    },
    rule: rule && { date: rule.date, url: rule.url, days: daysBetween(today, rule.date) },
  }
}

const LONG: Record<string, string> = { Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June', Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December' }
