import { createServiceClient } from '@/lib/supabase'
import { sendOwnerEmail } from '@/lib/email'
import { pingIndexNow } from '@/lib/indexnow'
import { DGCA_EXAMS, sessionById } from '@/lib/dgca-exams'
import { EXAM_RESULTS_PATH, UPDATES_PATH } from '@/lib/dgca-updates'
import {
  matchResultSession, noticeDateFromTitle, resultActionLink, revalidateResultPages,
} from '@/lib/dgca-results'
import {
  changesEmail, diffNotices, failingEmail, fetchNotices, groupOf, GROUPS, isPilotBoardResult, newCalendarYears, notPublishedReason,
  PARIKSHA_HOME, type Notice, type Published,
} from '@/lib/dgca-notices'

// The DGCA notice check, run by Vercel Cron twice a day (vercel.json: two daily jobs, as the
// Hobby plan allows one run a day per job, at 07:30 and 13:30 UTC,
// 13:00 and 19:00 IST; DGCA posts notices on weekdays between about 10:00 and 17:30 IST).
// Fetches the Pariksha home page and compares its notices with the last saved list
// (lib/dgca-notices.ts). A new result notice on the Pilot board is published to dgca_results
// straight away, matched to its session (unmatched ones are added hidden), and the pages that
// show results are revalidated and pinged to IndexNow. The email lists what was published,
// with a signed "Hide this" link, then the other new or changed notices. Each run is logged
// in dgca_notice_snapshots; when two runs in a row fail it emails that the check is failing,
// at most once every 6 hours.
//
// Vercel sends "Authorization: Bearer <CRON_SECRET>". The same header runs it by hand;
// ?dry=1 returns the email it would send without sending or saving anything.
// ?inject=<title> is a test run: it adds a Pilot-board notice with that title (linking to the
// Pariksha home page) to what DGCA lists (inject can be repeated; with dry=1, nothing is saved), and does everything a real run does except the
// IndexNow ping. Test runs are logged with trigger 'test' and never become the baseline, so
// the next real run compares with the last real list.
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const ALERT_EVERY_MS = 6 * 3600 * 1000

type Row = { ran_at: string; ok: boolean; error: string | null; notices: Notice[] | null; emailed: string | null; email_error: string | null; trigger: string }

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return Response.json({ error: 'CRON_SECRET is not set' }, { status: 500 })
  if (req.headers.get('authorization') !== `Bearer ${secret}`) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const params = new URL(req.url).searchParams
  const dry = params.get('dry') === '1'
  const inject = params.getAll('inject').map(t => t.trim()).filter(Boolean)
  const test = inject.length > 0
  const trigger = test ? 'test' : /vercel-cron/i.test(req.headers.get('user-agent') ?? '') ? 'cron' : 'manual'
  const db = createServiceClient()

  const { data: recent, error: readError } = await db.from('dgca_notice_snapshots')
    .select('ran_at, ok, error, notices, emailed, email_error, trigger').order('ran_at', { ascending: false }).limit(20)
  if (readError) return Response.json({ error: `dgca_notice_snapshots: ${readError.message}` }, { status: 500 })
  const runs = ((recent ?? []) as Row[]).filter(r => r.trigger !== 'test')
  // Compare with the last list that was reported (a run whose email failed doesn't count, so
  // its changes are sent again next time).
  const baseline = runs.find(r => r.ok && !r.email_error)?.notices ?? null

  let notices: Notice[]
  try {
    notices = await fetchNotices()
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e)
    // This failure plus the failed runs since the last good one.
    const lastOk = runs.findIndex(r => r.ok)
    const streak = [error, ...(lastOk < 0 ? runs : runs.slice(0, lastOk)).map(r => r.error ?? 'unknown error')]
    const lastAlert = runs.find(r => r.emailed === 'failing')
    const alertedRecently = !!lastAlert && Date.now() - Date.parse(lastAlert.ran_at) < ALERT_EVERY_MS
    const email = streak.length >= 2 && !alertedRecently ? failingEmail(streak) : null
    if (dry) return Response.json({ ok: false, error, failuresInARow: streak.length, alertedRecently, wouldEmail: email?.subject ?? null })
    let emailError: string | null = null
    if (email) await sendOwnerEmail(email).catch(err => { emailError = String(err?.message ?? err) })
    await db.from('dgca_notice_snapshots').insert({ ok: false, error, emailed: email && !emailError ? 'failing' : null, email_error: emailError, trigger })
    return Response.json({ ok: false, error, failuresInARow: streak.length, alertedRecently, emailed: !!email && !emailError, emailError }, { status: 502 })
  }

  if (test) notices = [...inject.map((title, i) => ({ board: 'pilot' as const, title, url: `${PARIKSHA_HOME}#test-${Date.now()}-${i}` })), ...notices]
  const changes = diffNotices(baseline, notices)

  // New result notices on the Pilot board: published straight away, unless notPublishedReason
  // says why not (a first run, when every notice on the board counts as new; a changed title;
  // no link; an AME result). Every one is listed at the top of the email.
  const published: Published[] = []
  for (const c of changes) {
    if (!isPilotBoardResult(c)) continue
    const reason = notPublishedReason(c, !baseline)
    if (reason || !c.url) {
      published.push({ title: c.title, url: c.url, sessionName: null, status: 'not_published', reason: reason ?? undefined, hideLink: null })
      continue
    }
    const sessionId = matchResultSession(c.title)
    const sessionName = sessionId ? sessionById(sessionId)?.name ?? sessionId : null
    const entry: Published = { title: c.title, url: c.url, sessionName, status: sessionId ? 'published' : 'hidden', hideLink: null }
    if (!dry) {
      const { data, error } = await db.from('dgca_results').upsert(
        { session_id: sessionId, label: c.title, url: c.url, notice_date: noticeDateFromTitle(c.title), hidden: !sessionId, source: 'auto' },
        { onConflict: 'url', ignoreDuplicates: true },
      ).select('id')
      if (error) Object.assign(entry, { status: 'failed', reason: error.message })
      else if (!data?.length) entry.status = 'already'
      else if (sessionId) entry.hideLink = resultActionLink('hide', (data[0] as { id: number }).id)
    }
    published.push(entry)
  }
  const live = published.filter(p => p.status === 'published')

  const latestPublished = Math.max(...DGCA_EXAMS.calendars.filter(c => c.status === 'published').map(c => c.year))
  const email = changes.length ? changesEmail(changes, { firstRun: !baseline, found: notices.length, afterYear: latestPublished, published, test }) : null
  const summary = {
    found: notices.length,
    byBoard: Object.fromEntries(['pilot', 'ame', 'banner', 'menu'].map(b => [b, notices.filter(n => n.board === b).length])),
    changes: changes.length,
    byGroup: Object.fromEntries(GROUPS.map(g => [g, changes.filter(c => groupOf(c) === g).length]).filter(([, n]) => n)),
    newCalendarYears: newCalendarYears(changes, latestPublished),
    results: published,
  }
  if (dry) return Response.json({ ok: true, dry: true, ...summary, email: email && { subject: email.subject, text: email.text } })

  let emailError: string | null = null
  if (email) await sendOwnerEmail(email).catch(err => { emailError = String(err?.message ?? err) })
  const { error: writeError } = await db.from('dgca_notice_snapshots').insert({
    ok: true, notices, changes, emailed: email && !emailError ? 'changes' : null, email_error: emailError, trigger,
  })
  if (writeError) console.error('[dgca-notices] log write failed:', writeError.message)

  // The results pages (and the last check's date on every page that shows it).
  revalidateResultPages(true)
  const indexNow = live.length && !test
    ? await pingIndexNow([EXAM_RESULTS_PATH, UPDATES_PATH].map(p => `https://www.propilotlicence.com${p}`))
    : null
  return Response.json({ ok: true, test, ...summary, emailed: !!email && !emailError, emailError, logged: !writeError, indexNow })
}
