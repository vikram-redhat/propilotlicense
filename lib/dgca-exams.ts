import raw from '@/lib/data/dgca-exam-sessions.json'

// DGCA exam sessions, venues and other dated updates, from lib/data/dgca-exam-sessions.json:
// DGCA's published calendar and the Pariksha notice board, kept current by hand after the
// notice check (app/api/cron/dgca-notices) emails what changed. The exam dates and results
// guides, the DGCA Updates hub, the updates bar and the dashboard card render from it (the
// last three through lib/dgca-updates.ts).
//
// Result notices live in the dgca_results table (lib/dgca-results.ts), which the notice check
// publishes to; the functions here take them as an argument. The file's `results` array is
// only the table's seed, and the fallback when the table can't be read. Likewise the last
// check's date comes from the notice check's log, with lastCheckedAgainstDGCA as the fallback.
//
// Everything in that file is public, so pages and the browser may import it. Details waiting
// for Captain Panel confirmation (fees, resit waiting period) are kept apart, in
// lib/data/dgca-exam-unverified.json, which nothing imports.

export type SessionType = 'regular' | 'olode' | 'fir_afir'

export type ExamSession = {
  id: string
  type: SessionType
  name: string
  examStart: string // YYYY-MM-DD
  examEnd: string
  portalOpen: string | null
  portalClose: string | null
}

export type ResultNotice = {
  session: string | null // ExamSession id (null: not matched to a session; such rows are hidden)
  label: string
  url: string
  noticeDate: string | null
  seenOn: string
}

export type ExamData = {
  lastCheckedAgainstDGCA: string
  source: string
  calendars: { year: number; status: 'published' | 'not_published'; url: string | null; note: string | null }[]
  sessions: ExamSession[]
  venues: { session: string; url: string; centres: { city: string; centre: string }[] }
  results: ResultNotice[]
  updates: DgcaUpdate[]
}

// Dated events that aren't exam sessions or results (rule changes). countdown: show the days
// to go while it's in the future (the updates bar and the dashboard card).
export type DgcaUpdate = { date: string; type: 'rule'; title: string; url: string; countdown?: boolean }

const data = raw as typeof raw & ExamData
export const DGCA_EXAMS: ExamData = {
  lastCheckedAgainstDGCA: data.lastCheckedAgainstDGCA,
  source: data.source,
  calendars: data.calendars,
  sessions: [...data.sessions].sort((a, b) => a.examStart.localeCompare(b.examStart)),
  venues: data.venues,
  results: data.results,
  updates: [...(data.updates as DgcaUpdate[])].sort((a, b) => a.date.localeCompare(b.date)),
}

export const SESSION_TYPE_LABEL: Record<SessionType, string> = {
  regular: 'Regular',
  olode: 'On-demand (OLODE)',
  fir_afir: 'FIR/AFIR oral',
}

// Today's date in India (YYYY-MM-DD): sessions and portal windows roll over at midnight IST.
export function todayInIndia(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

function parts(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m, d }
}
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// "19 November 2026"
export function formatLongDate(iso: string): string {
  const { y, m, d } = parts(iso)
  return `${d} ${MONTHS_LONG[m - 1]} ${y}`
}

// "19 Nov 2026", or "19 Nov" without the year
export function formatShortDate(iso: string, withYear = true): string {
  const { y, m, d } = parts(iso)
  return `${d} ${MONTHS[m - 1]}${withYear ? ` ${y}` : ''}`
}

// "18–20 Nov 2026", "28 Nov – 2 Dec 2026", "29 Dec 2026 – 2 Jan 2027"
export function formatRange(start: string, end: string): string {
  const a = parts(start), b = parts(end)
  if (start === end) return formatShortDate(start)
  if (a.y !== b.y) return `${formatShortDate(start)} – ${formatShortDate(end)}`
  if (a.m !== b.m) return `${formatShortDate(start, false)} – ${formatShortDate(end)}`
  return `${a.d}–${b.d} ${MONTHS[b.m - 1]} ${b.y}`
}

// "15 to 19 December 2026", for running text
export function formatRangeLong(start: string, end: string): string {
  const a = parts(start), b = parts(end)
  if (a.y !== b.y) return `${formatLongDate(start)} to ${formatLongDate(end)}`
  if (a.m !== b.m) return `${a.d} ${MONTHS_LONG[a.m - 1]} to ${formatLongDate(end)}`
  return `${a.d} to ${formatLongDate(end)}`
}

export function portalStatus(s: ExamSession, today: string): string {
  if (!s.portalOpen || !s.portalClose) return 'Check the Pariksha notice board'
  if (today < s.portalOpen) return `Opens ${formatShortDate(s.portalOpen, false)}`
  if (today <= s.portalClose) return `Open until ${formatShortDate(s.portalClose, false)}`
  return 'Closed'
}

// The next sessions still to finish (examEnd today or later), soonest first.
export function upcomingSessions(today: string, type?: SessionType): ExamSession[] {
  return DGCA_EXAMS.sessions.filter(s => s.examEnd >= today && (!type || s.type === type))
}

export function sessionById(id: string): ExamSession | undefined {
  return DGCA_EXAMS.sessions.find(s => s.id === id)
}

// Calendar years: the current year in India (or the latest published one before it), and the
// year after it.
export function calendarYears(today: string) {
  const year = Number(today.slice(0, 4))
  const published = DGCA_EXAMS.calendars.filter(c => c.status === 'published' && c.year <= year).sort((a, b) => b.year - a.year)
  const current = published[0] ?? null
  const nextYear = (current?.year ?? year) + 1
  const next = DGCA_EXAMS.calendars.find(c => c.year === nextYear && c.status === 'published') ?? null
  return { current, next, nextYear }
}

export function sessionsInYear(year: number): ExamSession[] {
  return DGCA_EXAMS.sessions.filter(s => s.examStart.startsWith(`${year}-`))
}

// Result notices, newest session first.
export function latestResults(results: ResultNotice[]): (ResultNotice & { sessionEnd: string | null })[] {
  return results
    .map(r => ({ ...r, sessionEnd: (r.session && sessionById(r.session)?.examEnd) || null }))
    .sort((a, b) => (b.sessionEnd ?? b.noticeDate ?? b.seenOn).localeCompare(a.sessionEnd ?? a.noticeDate ?? a.seenOn))
}

// Sessions whose exams have started (so are finished or under way) and ended no more than
// 30 days ago, with no result notice yet. Older sessions' results will be out, even if the
// notice has already scrolled off DGCA's notice board.
export function awaitingResults(today: string, results: ResultNotice[]): ExamSession[] {
  const t = new Date(`${today}T00:00:00Z`)
  t.setUTCDate(t.getUTCDate() - 30)
  const cutoff = t.toISOString().slice(0, 10)
  const declared = new Set(results.map(r => r.session))
  return DGCA_EXAMS.sessions
    .filter(s => s.examStart <= today && s.examEnd >= cutoff && !declared.has(s.id))
    .sort((a, b) => b.examStart.localeCompare(a.examStart))
}

// The two guides that render from this data. Their dateModified (and sitemap lastmod) is the
// later of their registry updatedAt (an editorial change) and the last check against DGCA.
export const DGCA_EXAM_GUIDE_SLUGS: ReadonlySet<string> = new Set(['dgca-exam-dates', 'dgca-exam-results'])
export function dgcaExamGuideUpdatedAt(registryUpdatedAt: string, lastChecked: string): string {
  return registryUpdatedAt > lastChecked ? registryUpdatedAt : lastChecked
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
