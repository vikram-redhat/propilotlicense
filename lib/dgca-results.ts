import { createHmac, timingSafeEqual } from 'crypto'
import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase'
import { DGCA_EXAMS, todayInIndia, type ResultNotice, type SessionType } from '@/lib/dgca-exams'
import { EXAM_DATES_PATH, EXAM_RESULTS_PATH, UPDATES_PATH } from '@/lib/dgca-updates'

// DGCA result notices, from the dgca_results table (scripts/migrate_dgca_results.sql), and
// the date of the last successful notice check, from dgca_notice_snapshots. Server only (the
// service key). The notice check (app/api/cron/dgca-notices) inserts a row for each new
// result notice on the Pilot board; the signed link in its email hides one
// (app/api/dgca-results/hide).

export type ResultRow = {
  id: number
  session_id: string | null
  label: string
  url: string
  notice_date: string | null
  seen_at: string
  hidden: boolean
  source: 'auto' | 'manual'
}

export const toNotice = (r: ResultRow): ResultNotice => ({
  session: r.session_id, label: r.label, url: r.url, noticeDate: r.notice_date, seenOn: todayInIndia(new Date(r.seen_at)), source: r.source,
})

// The published (not hidden) results. If the table can't be read, the data file's seed list,
// so the pages still render.
export async function getDgcaResults(): Promise<ResultNotice[]> {
  const { data, error } = await createServiceClient().from('dgca_results').select('*').eq('hidden', false)
  if (error) {
    console.error('[dgca-results] read failed, using the data file:', error.message)
    return DGCA_EXAMS.results
  }
  return (data as ResultRow[]).map(toNotice)
}

// The day (in India) of the last successful notice check; the data file's date if there's
// none or the log can't be read.
export async function getLastChecked(): Promise<string> {
  const { data, error } = await createServiceClient().from('dgca_notice_snapshots')
    .select('ran_at').eq('ok', true).order('ran_at', { ascending: false }).limit(1)
  if (error) console.error('[dgca-results] last check read failed:', error.message)
  const ranAt = (data?.[0] as { ran_at: string } | undefined)?.ran_at
  return ranAt ? todayInIndia(new Date(ranAt)) : DGCA_EXAMS.lastCheckedAgainstDGCA
}

// Pages that show results (or the last check's date), and the bar's data route. Called when a
// result row changes, and after each successful check.
export const RESULT_PAGES = [EXAM_RESULTS_PATH, UPDATES_PATH, '/api/dgca-results'] as const
export function revalidateResultPages(withLastChecked = false) {
  for (const p of RESULT_PAGES) revalidatePath(p)
  if (withLastChecked) { revalidatePath(EXAM_DATES_PATH); revalidatePath('/sitemap.xml') }
}

// ── Matching a notice to a session ───────────────────────────────────────────

const ID_PREFIX: Record<SessionType, string> = { olode: 'olod', regular: 'reg', fir_afir: 'fir' }

// "Declaration of FC Result for OLODE 07 of 2026" -> olod-07-2026. The type is FIR/AFIR
// (checked first: their sessions are also called "Regular Session 10"), OLODE/OLOD or
// Regular; then the session number and year, "07 of 2026" or "07/2026", with or without the
// word "Session". Without a year ("Session 08"), the most recent session of that type and
// number that has started. Anything else (FATA, RTR) matches nothing.
export function matchResultSession(title: string, today = todayInIndia()): string | null {
  const type: SessionType | null = /\bA?FIR\b/i.test(title) ? 'fir_afir'
    : /\bOLODE?\b/i.test(title) ? 'olode'
    : /\bregular\b/i.test(title) ? 'regular'
    : null
  const withYear = title.match(/\b(?:session\s*(?:no\.?\s*)?[-–:]?\s*)?0*(\d{1,2})\s*(?:of|\/)\s*(20\d\d)\b/i)
  const num = withYear?.[1] ?? title.match(/\bsession\s*(?:no\.?\s*)?[-–:]?\s*0*(\d{1,2})\b/i)?.[1]
  if (!type || !num) return null
  const year = withYear?.[2]
  const prefix = `${ID_PREFIX[type]}-${num.padStart(2, '0')}-`
  const candidates = DGCA_EXAMS.sessions
    .filter(s => s.type === type && s.id.startsWith(prefix) && (year ? s.id.endsWith(year) : s.examStart <= today))
    .sort((a, b) => b.examStart.localeCompare(a.examStart))
  return candidates[0]?.id ?? null
}

// A date written in the title ("dated 03.11.2026", "03/11/2026"), as YYYY-MM-DD.
export function noticeDateFromTitle(title: string): string | null {
  const m = title.match(/\b(\d{1,2})[./-](\d{1,2})[./-](20\d\d)\b/)
  if (!m) return null
  const [d, mo, y] = [Number(m[1]), Number(m[2]), m[3]]
  if (d < 1 || d > 31 || mo < 1 || mo > 12) return null
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

// ── The signed "Hide this" link ──────────────────────────────────────────────

const SITE = 'https://www.propilotlicence.com'
export const HIDE_LINK_DAYS = 7
export type HideAction = 'hide' | 'show'

function sign(action: HideAction, id: number, exp: number): string {
  const secret = process.env.CRON_SECRET
  if (!secret) throw new Error('CRON_SECRET is not set')
  return createHmac('sha256', secret).update(`dgca-result:${action}:${id}:${exp}`).digest('base64url')
}

// A link that needs no login, valid for 7 days from now (or until `exp`, seconds).
export function resultActionLink(action: HideAction, id: number, exp = Math.floor(Date.now() / 1000) + HIDE_LINK_DAYS * 86400): string {
  return `${SITE}/api/dgca-results/hide?${new URLSearchParams({ action, id: String(id), exp: String(exp), sig: sign(action, id, exp) })}`
}

export function verifyResultAction(action: HideAction, id: number, exp: number, sig: string): 'ok' | 'expired' | 'bad' {
  let expected: Buffer
  try { expected = Buffer.from(sign(action, id, exp)) } catch { return 'bad' }
  const given = Buffer.from(sig)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return 'bad'
  return exp * 1000 < Date.now() ? 'expired' : 'ok'
}
