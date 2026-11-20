// The DGCA notice check (app/api/cron/dgca-notices, twice a day): reads the Pariksha home
// page, lists its notices (the Pilot and AME notice boards, the portal-window banner, and the
// Examinations menu's calendar links), and compares them with the last saved list in
// dgca_notice_snapshots (scripts/migrate_dgca_notice_snapshots.sql). A new result notice on
// the Pilot board is published to dgca_results (lib/dgca-results.ts); the email lists what
// was published first, then the other new or changed notices, grouped by kind, so
// lib/data/dgca-exam-sessions.json can be updated by hand.

export const PARIKSHA_HOME = 'https://pariksha.dgca.gov.in/home'
const ORIGIN = 'https://pariksha.dgca.gov.in'

export type Board = 'pilot' | 'ame' | 'banner' | 'menu'
export type Notice = { board: Board; title: string; url: string | null }

export const BOARD_LABEL: Record<Board, string> = {
  pilot: 'Notice Board – Pilot',
  ame: 'Notice Board – AME',
  banner: 'Portal banner',
  menu: 'Examinations menu',
}

const clean = (s: string) => s
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ').trim()

// DGCA links are written "/PDFViewer.jsp?..." or "/../PDFViewer.jsp?...": made absolute.
function absolute(href: string): string {
  try { return new URL(href.replace(/^\/\.\.\//, '/'), ORIGIN).toString() } catch { return href }
}

function links(fragment: string, board: Board): Notice[] {
  return [...fragment.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map(m => ({ board, title: clean(m[2]), url: absolute(m[1]) }))
    .filter(n => n.title)
}

// The marquee under a board's heading link (NOTICE BOARD-PILOT / NOTICE BOARD-AME).
function boardNotices(html: string, heading: RegExp, board: Board): Notice[] {
  const at = html.search(heading)
  if (at < 0) return []
  const start = html.indexOf('<marquee', at)
  const end = html.indexOf('</marquee>', start)
  return start < 0 || end < 0 ? [] : links(html.slice(start, end), board)
}

export function parseNotices(page: string): Notice[] {
  const html = page.replace(/<!--[\s\S]*?-->/g, '') // DGCA leaves old markup commented out
  const notices: Notice[] = [
    ...boardNotices(html, /href=["'][^"']*Notice_Board_General_PLT["'][^>]*>\s*NOTICE BOARD-PILOT/i, 'pilot'),
    ...boardNotices(html, /href=["'][^"']*Notice_Board_General["'][^>]*>\s*NOTICE BOARD-AME/i, 'ame'),
  ]
  // The portal-window banner: one line per span.
  const banner = html.match(/<div class="blinking-text"[^>]*>([\s\S]*?)<\/div>/i)
  if (banner) {
    for (const m of banner[1].matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/gi)) {
      const title = clean(m[1])
      if (title) notices.push({ board: 'banner', title, url: null })
    }
  }
  // Exam calendars, from the Examinations menu (so a new year's calendar is noticed).
  for (const n of links(html, 'menu')) if (/calendar/i.test(n.title)) notices.push(n)
  // The same notice can be listed twice on one board: keep one.
  const seen = new Set<string>()
  return notices.filter(n => { const k = noticeKey(n); return seen.has(k) ? false : (seen.add(k), true) })
}

export function noticeKey(n: Notice): string {
  return `${n.board}|${n.url ?? n.title}`
}

export type Change = Notice & { change: 'new' | 'changed'; previousTitle?: string }

// New notices, and notices whose title changed at the same link. A banner line has no
// link, so a changed banner shows as new.
export function diffNotices(previous: Notice[] | null, current: Notice[]): Change[] {
  const before = new Map((previous ?? []).map(n => [noticeKey(n), n]))
  const changes: Change[] = []
  for (const n of current) {
    const old = before.get(noticeKey(n))
    if (!old) changes.push({ ...n, change: 'new' })
    else if (old.title !== n.title) changes.push({ ...n, change: 'changed', previousTitle: old.title })
  }
  return changes
}

export const GROUPS = [
  'New sessions or portal windows',
  'Venue lists',
  'Admit cards',
  'Results (pilot board)', // listed at the top of the email instead (published or not)
  'AME results (ignored, not published)',
  'Calendars',
  'Other',
] as const
export type Group = (typeof GROUPS)[number]

export function groupOf(n: Notice): Group {
  const t = n.title
  if (/calendar/i.test(t)) return 'Calendars'
  if (n.board === 'pilot' && /result/i.test(t)) return 'Results (pilot board)'
  if (n.board === 'ame' && /result/i.test(t)) return 'AME results (ignored, not published)'
  if (/venue/i.test(t)) return 'Venue lists'
  if (/admit card/i.test(t)) return 'Admit cards'
  if (n.board === 'banner' || /public notice|portal|schedule|time ?table/i.test(t)) return 'New sessions or portal windows'
  return 'Other'
}

// A result notice on the Pilot board ("Result" in the title). The check publishes it unless
// notPublishedReason says why not. AME-board notices are never published.
export function isPilotBoardResult(n: Notice): boolean {
  return n.board === 'pilot' && /result/i.test(n.title)
}

// Why a Pilot-board result notice isn't published automatically, or null if it can be (then
// it's still added hidden when it can't be matched to a session).
export function notPublishedReason(c: Change, firstRun: boolean): string | null {
  if (firstRun) return 'First run of the check: nothing is published, as every notice on the board counts as new.'
  if (c.change === 'changed') return `Its title changed at a link already seen (was: “${c.previousTitle ?? ''}”), so nothing was published. Check whether dgca_results needs the new title.`
  if (!c.url) return 'The notice has no PDF link to publish.'
  if (/\bAME\b/i.test(c.title) && !/\bFC\b|flight crew/i.test(c.title)) return 'The title mentions AME without FC or Flight Crew, so it was treated as an AME result. If it is a pilot result, add it to dgca_results by hand.'
  return null
}

// An exam calendar link for a year after the latest one in the data file, new this run.
export function newCalendarYears(changes: Change[], afterYear: number): number[] {
  const years = changes
    .filter(c => groupOf(c) === 'Calendars')
    .flatMap(c => [...c.title.matchAll(/\b(20\d\d)\b/g)].map(m => Number(m[1])))
    .filter(y => y > afterYear)
  return [...new Set(years)].sort()
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// What the check did with a new result notice on the Pilot board, for the email.
export type Published = {
  title: string
  url: string | null
  sessionName: string | null // the matched session; null: not matched, so inserted hidden
  status: 'published' | 'already' | 'hidden' | 'failed' | 'not_published'
  reason?: string // why it failed or wasn't published
  hideLink: string | null
}
// Statuses listed under "Pilot result NOT published (needs attention)".
const NEEDS_ATTENTION: ReadonlySet<Published['status']> = new Set(['hidden', 'failed', 'not_published'])

function publishedLine(p: Published): string {
  switch (p.status) {
    case 'published': return `Published for ${p.sessionName}: on the results guide, in the updates bar and on DGCA Updates.`
    case 'hidden': return 'Not matched to a session, so it was added hidden and isn’t shown anywhere. Add the session to the data file, set its session_id in dgca_results and set hidden to false.'
    case 'already': return 'Already in dgca_results: nothing changed.'
    case 'failed': return `Couldn’t be saved (${p.reason ?? 'unknown error'}): add it to dgca_results by hand.`
    case 'not_published': return p.reason ?? 'Not published.'
  }
}

export function changesEmail(allChanges: Change[], opts: { firstRun: boolean; found: number; afterYear: number; published?: Published[]; test?: boolean }): { subject: string; html: string; text: string } {
  const published = opts.published ?? []
  // Pilot-board results are listed once, at the top (needing attention first), not again
  // under their group.
  const changes = allChanges.filter(c => groupOf(c) !== 'Results (pilot board)')
  const years = newCalendarYears(changes, opts.afterYear)
  const attention = published.filter(p => NEEDS_ATTENTION.has(p.status))
  const done = published.filter(p => !NEEDS_ATTENTION.has(p.status))
  const live = published.filter(p => p.status === 'published')
  const subject = (opts.test ? '[TEST] ' : '') + (
    attention.length ? `DGCA pilot result NOT published (needs attention): ${attention.map(p => p.title).join('; ')}${live.length ? `; ${live.length} published` : ''}`
    : live.length ? `DGCA result published: ${live.map(p => p.title).join('; ')}`
    : published.length ? `DGCA result notice already published: ${published.map(p => p.title).join('; ')}`
    : years.length ? `DGCA ${years.join(', ')} exam calendar is out, plus ${changes.length} notice change${changes.length === 1 ? '' : 's'}`
    : opts.firstRun ? `DGCA notice check: first run, ${changes.length} notices on the Pariksha home page`
    : `DGCA notices: ${changes.length} new or changed`)
  const intro = opts.firstRun
    ? `First run of the check: there is no earlier list to compare with, so every notice on the Pariksha home page is listed (${opts.found}). From the next check, only new or changed notices are emailed.`
    : changes.length
      ? `${changes.length} ${published.length ? 'other ' : ''}new or changed notice${changes.length === 1 ? '' : 's'} on the Pariksha home page since the last check. Update lib/data/dgca-exam-sessions.json from these.`
      : 'No other new or changed notices since the last check.'

  const resultCard = (p: Published) => `<div style="margin:0 0 14px;padding:12px 14px;background:${NEEDS_ATTENTION.has(p.status) ? '#fdecea' : '#eaf6ee'};border-radius:8px;font-size:14px;line-height:1.5;">
<div>${p.url ? `<a href="${esc(p.url)}" style="color:#185FA5;font-weight:600;">${esc(p.title)}</a>` : `<strong>${esc(p.title)}</strong>`}</div>
<div style="margin-top:4px;">${NEEDS_ATTENTION.has(p.status) ? '<strong>Reason:</strong> ' : ''}${esc(publishedLine(p))}</div>
${p.hideLink ? `<div style="margin-top:10px;"><a href="${esc(p.hideLink)}" style="display:inline-block;padding:6px 12px;border:1px solid #c47d00;border-radius:6px;color:#7a5200;text-decoration:none;font-weight:600;">Hide this</a> <span style="color:#6b7080;font-size:12px;">No login needed; works for 7 days.</span></div>` : ''}
</div>`
  const resultsHtml = [
    attention.length ? `<h2 style="font-size:15px;margin:0 0 8px;color:#a3261a;">Pilot result NOT published (needs attention)</h2>\n${attention.map(resultCard).join('\n')}` : '',
    done.length ? `<h2 style="font-size:15px;margin:0 0 8px;">New result notice${done.length === 1 ? '' : 's'} published (Pilot board)</h2>\n${done.map(resultCard).join('\n')}` : '',
  ].filter(Boolean).join('\n')

  const sections = GROUPS.map(g => ({ g, items: changes.filter(c => groupOf(c) === g) })).filter(s => s.items.length)
  const item = (c: Change) => {
    const title = c.url ? `<a href="${esc(c.url)}" style="color:#185FA5;">${esc(c.title)}</a>` : esc(c.title)
    const note = c.change === 'changed' ? ` <span style="color:#7a5200;">(changed; was: ${esc(c.previousTitle ?? '')})</span>` : ''
    return `<li style="margin:0 0 8px;">${title}${note} <span style="color:#6b7080;font-size:12px;">· ${BOARD_LABEL[c.board]}</span></li>`
  }
  const html = `<!doctype html><html><body style="margin:0;padding:24px 16px;background:#f7f8fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0d1117;">
<div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e2e4ea;border-radius:12px;padding:24px;">
<h1 style="font-size:18px;margin:0 0 12px;">DGCA notice check${opts.test ? ' (test run)' : ''}</h1>
${resultsHtml}
${years.length ? `<p style="margin:0 0 14px;padding:12px 14px;background:#fdf4dc;border-left:3px solid #c47d00;font-size:14px;"><strong>The ${years.join(', ')} exam calendar link has appeared.</strong> Add it to the calendars in the data file, with its sessions.</p>` : ''}
<p style="font-size:14px;line-height:1.6;color:#353a47;margin:0 0 18px;">${esc(intro)}</p>
${sections.map(s => `<h2 style="font-size:15px;margin:18px 0 8px;">${s.g} (${s.items.length})</h2><ul style="padding-left:18px;margin:0;font-size:14px;line-height:1.5;">${s.items.map(item).join('')}</ul>`).join('\n')}
<p style="font-size:12px;color:#6b7080;margin:22px 0 0;">Source: <a href="${PARIKSHA_HOME}" style="color:#6b7080;">${PARIKSHA_HOME}</a></p>
</div></body></html>`
  const text = [
    subject, '',
    ...([['Pilot result NOT published (needs attention)', attention], ['New result notices published (Pilot board)', done]] as const)
      .filter(([, list]) => list.length)
      .flatMap(([heading, list]) => [heading, ...list.flatMap(p => [`- ${p.title}`, ...(p.url ? [`  ${p.url}`] : []), `  ${NEEDS_ATTENTION.has(p.status) ? 'Reason: ' : ''}${publishedLine(p)}`, ...(p.hideLink ? [`  Hide this (no login, works for 7 days): ${p.hideLink}`] : [])]), '']),
    intro, '',
    ...sections.flatMap(s => [`${s.g} (${s.items.length})`, ...s.items.map(c => `- ${c.title}${c.change === 'changed' ? ` (changed; was: ${c.previousTitle})` : ''} [${BOARD_LABEL[c.board]}]${c.url ? `\n  ${c.url}` : ''}`), '']),
    `Source: ${PARIKSHA_HOME}`,
  ].join('\n')
  return { subject, html, text }
}

export function failingEmail(errors: string[]): { subject: string; html: string; text: string } {
  const subject = 'DGCA notice check is failing'
  const text = `The DGCA notice check has failed ${errors.length} times in a row, so new DGCA notices may be going unnoticed.\n\n${errors.map((e, i) => `Run ${i + 1}: ${e}`).join('\n')}\n\nCheck ${PARIKSHA_HOME} by hand, and the Vercel logs for /api/cron/dgca-notices. While it keeps failing, this email is sent at most once every 6 hours.`
  const html = `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0d1117;padding:24px 16px;"><div style="max-width:640px;margin:0 auto;"><h1 style="font-size:18px;">${subject}</h1><p style="font-size:14px;line-height:1.6;white-space:pre-line;">${esc(text)}</p></div></body></html>`
  return { subject, html, text }
}

// Fetches the home page; a page with no Pilot board notices counts as a failure (DGCA
// changed the page, or served an error page with status 200).
export async function fetchNotices(): Promise<Notice[]> {
  let lastError: unknown
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(PARIKSHA_HOME, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ProPilotLicence notice check; +https://www.propilotlicence.com)' },
        signal: AbortSignal.timeout(25_000),
        cache: 'no-store',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const notices = parseNotices(await res.text())
      if (!notices.some(n => n.board === 'pilot')) throw new Error('No Pilot notice board found on the page')
      return notices
    } catch (e) {
      lastError = e
      if (attempt === 0) await new Promise(r => setTimeout(r, 5000))
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}
