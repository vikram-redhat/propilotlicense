import { createServiceClient } from '@/lib/supabase'
import { escapeHtml } from '@/lib/dgca-exams'
import { resultActionLink, revalidateResultPages, verifyResultAction, type HideAction, type ResultRow } from '@/lib/dgca-results'

// The "Hide this" link in the notice check's email for an auto-published result: hides that
// row in dgca_results (gone from the results guide, the updates bar and /dgca-updates), with
// no login. The link is signed with CRON_SECRET and expires after 7 days
// (lib/dgca-results.ts). The page it shows has a signed "Show it again" link, in case the
// link was opened by mistake (or by an email scanner).
export const dynamic = 'force-dynamic'

const page = (title: string, body: string, status = 200) => new Response(
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:40px 16px;background:#f7f8fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0d1117;">
<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2e4ea;border-radius:12px;padding:24px;font-size:15px;line-height:1.6;">
<h1 style="font-size:19px;margin:0 0 10px;">${escapeHtml(title)}</h1>${body}</div></body></html>`,
  { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
)

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams
  const action = q.get('action') === 'show' ? 'show' : 'hide' as HideAction
  const id = Number(q.get('id')), exp = Number(q.get('exp'))
  const check = Number.isInteger(id) && Number.isInteger(exp) ? verifyResultAction(action, id, exp, q.get('sig') ?? '') : 'bad'
  if (check === 'bad') return page('Link not valid', '<p>This link isn’t valid. Use the link from the email as it was sent.</p>', 403)
  if (check === 'expired') return page('Link expired', '<p>This link has expired (links last 7 days). Change the row in the dgca_results table in Supabase instead.</p>', 410)

  const { data, error } = await createServiceClient().from('dgca_results')
    .update({ hidden: action === 'hide' }).eq('id', id).select('*').maybeSingle()
  if (error) return page('Couldn’t change it', `<p>${escapeHtml(error.message)}</p><p>Try the link again in a minute.</p>`, 500)
  if (!data) return page('Result not found', '<p>There is no such result row (it may have been deleted).</p>', 404)
  revalidateResultPages()

  const row = data as ResultRow
  const label = `<p><strong>${escapeHtml(row.label)}</strong></p>`
  const other = action === 'hide' ? 'show' : 'hide'
  const otherLink = `<p style="margin-top:18px;"><a href="${escapeHtml(resultActionLink(other, id, exp))}" style="color:#185FA5;">${other === 'show' ? 'Show it again' : 'Hide it again'}</a></p>`
  return action === 'hide'
    ? page('Result hidden', `${label}<p>It’s no longer shown on the results guide, in the updates bar or on DGCA Updates. The pages update within a minute.</p>${otherLink}`)
    : page('Result shown again', `${label}<p>It’s back on the results guide, in the updates bar and on DGCA Updates. The pages update within a minute.</p>${otherLink}`)
}
