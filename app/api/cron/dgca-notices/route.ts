import { createServiceClient } from '@/lib/supabase'
import { sendOwnerEmail } from '@/lib/email'
import { DGCA_EXAMS } from '@/lib/dgca-exams'
import {
  changesEmail, diffNotices, failingEmail, fetchNotices, groupOf, GROUPS, newCalendarYears, type Notice,
} from '@/lib/dgca-notices'

// The weekly DGCA notice check, run by Vercel Cron (vercel.json: Mondays 03:30 UTC, 09:00 IST).
// Fetches the Pariksha home page, compares its notices with the last saved list, and emails the
// new or changed ones (lib/dgca-notices.ts). Each run is logged in dgca_notice_snapshots; when
// two runs in a row fail, it emails that the check is failing.
//
// Vercel sends "Authorization: Bearer <CRON_SECRET>". The same header runs it by hand;
// ?dry=1 returns the email it would send without sending or saving anything.
export const dynamic = 'force-dynamic'
export const maxDuration = 60

type Row = { ok: boolean; error: string | null; notices: Notice[] | null; email_error: string | null }

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return Response.json({ error: 'CRON_SECRET is not set' }, { status: 500 })
  if (req.headers.get('authorization') !== `Bearer ${secret}`) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const dry = new URL(req.url).searchParams.get('dry') === '1'
  const trigger = /vercel-cron/i.test(req.headers.get('user-agent') ?? '') ? 'cron' : 'manual'
  const db = createServiceClient()

  const { data: recent, error: readError } = await db.from('dgca_notice_snapshots')
    .select('ok, error, notices, email_error').order('ran_at', { ascending: false }).limit(20)
  if (readError) return Response.json({ error: `dgca_notice_snapshots: ${readError.message}` }, { status: 500 })
  const rows = (recent ?? []) as Row[]
  // Compare with the last list that was reported (a run whose email failed doesn't count, so
  // its changes are sent again next time).
  const baseline = rows.find(r => r.ok && !r.email_error)?.notices ?? null

  let notices: Notice[]
  try {
    notices = await fetchNotices()
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e)
    // This failure plus the failed runs since the last good one.
    const lastOk = rows.findIndex(r => r.ok)
    const streak = [error, ...(lastOk < 0 ? rows : rows.slice(0, lastOk)).map(r => r.error ?? 'unknown error')]
    const email = streak.length >= 2 ? failingEmail(streak) : null
    if (dry) return Response.json({ ok: false, error, failuresInARow: streak.length, wouldEmail: email?.subject ?? null })
    let emailError: string | null = null
    if (email) await sendOwnerEmail(email).catch(err => { emailError = String(err?.message ?? err) })
    await db.from('dgca_notice_snapshots').insert({ ok: false, error, emailed: email && !emailError ? 'failing' : null, email_error: emailError, trigger })
    return Response.json({ ok: false, error, failuresInARow: streak.length, emailed: !!email && !emailError, emailError }, { status: 502 })
  }

  const changes = diffNotices(baseline, notices)
  const latestPublished = Math.max(...DGCA_EXAMS.calendars.filter(c => c.status === 'published').map(c => c.year))
  const email = changes.length ? changesEmail(changes, { firstRun: !baseline, found: notices.length, afterYear: latestPublished }) : null
  const summary = {
    found: notices.length,
    byBoard: Object.fromEntries(['pilot', 'ame', 'banner', 'menu'].map(b => [b, notices.filter(n => n.board === b).length])),
    changes: changes.length,
    byGroup: Object.fromEntries(GROUPS.map(g => [g, changes.filter(c => groupOf(c) === g).length]).filter(([, n]) => n)),
    newCalendarYears: newCalendarYears(changes, latestPublished),
  }
  if (dry) return Response.json({ ok: true, dry: true, ...summary, email: email && { subject: email.subject, text: email.text } })

  let emailError: string | null = null
  if (email) await sendOwnerEmail(email).catch(err => { emailError = String(err?.message ?? err) })
  const { error: writeError } = await db.from('dgca_notice_snapshots').insert({
    ok: true, notices, changes, emailed: email && !emailError ? 'changes' : null, email_error: emailError, trigger,
  })
  if (writeError) console.error('[dgca-notices] log write failed:', writeError.message)
  return Response.json({ ok: true, ...summary, emailed: !!email && !emailError, emailError, logged: !writeError })
}
