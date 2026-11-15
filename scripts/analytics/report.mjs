// Local, read-only analytics checks with the GA4 / Search Console service account.
//
//   node scripts/analytics/report.mjs realtime   GA4: are cta_click, sign_up and practice_start
//                                                 arriving, and with which parameters?
//   node scripts/analytics/report.mjs baseline   Search Console: last-28-day baseline for the
//                                                 tracked pages, saved as a dated CSV
//
// The key stays outside the repo (default ~/.config/propilotlicence/ga-sc.json, or GA_SC_KEY).
// Never copy it into the repo, print it, or add it to Vercel. GA4 property: GA4_PROPERTY_ID or
// --property=<id>; without one the script uses the only property the account can see.
// No dependencies: the service-account token is signed here with node:crypto.

import { createSign } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const KEY_PATH = process.env.GA_SC_KEY ?? join(homedir(), '.config/propilotlicence/ga-sc.json')
const SITE = 'https://www.propilotlicence.com'
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), 'baselines')

// The events to check and the parameters each should carry (lib/analytics.ts and its callers).
const EVENTS = {
  cta_click: ['cta_location', 'page_path', 'link_url'],
  sign_up: ['method', 'signup_page'],
  practice_start: ['licence', 'subject', 'chapter', 'mode', 'scope', 'source_page'],
}
// GA4 built-in dimensions that some of those parameters fill.
const BUILT_IN = { link_url: 'linkUrl', method: 'method' }

// Search Console baseline: the two Bharatiya Vayuyan guides, the IC Joshi chapter pages and the
// A320 guides, as listed in the live sitemap.
const TRACKED = /\/bharatiya-vayuyan-|\/books\/ic-joshi[^/]*\/chapter-|a320/

// ---- auth ----

function loadKey() {
  try {
    return JSON.parse(readFileSync(KEY_PATH, 'utf8'))
  } catch {
    throw new Error(`No service-account key at ${KEY_PATH} (set GA_SC_KEY to its path)`)
  }
}

const tokens = {}
async function token(scope) {
  if (tokens[scope]) return tokens[scope]
  const key = loadKey()
  const b64 = obj => Buffer.from(JSON.stringify(obj)).toString('base64url')
  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
    iss: key.client_email, scope, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  })}`
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url')
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}` }),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(`Token request failed: ${body.error_description ?? body.error}`)
  return (tokens[scope] = body.access_token)
}

async function call(scope, url, body) {
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${await token(scope)}`, 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message ?? `HTTP ${res.status}`)
  return json
}

// ---- GA4 ----

const GA = 'https://www.googleapis.com/auth/analytics.readonly'
const gaData = (path, body) => call(GA, `https://analyticsdata.googleapis.com/v1beta/${path}`, body)

async function propertyId() {
  const arg = process.argv.find(a => a.startsWith('--property='))?.split('=')[1]
  const id = arg ?? process.env.GA4_PROPERTY_ID
  if (id) return id.replace(/^properties\//, '')
  const { accountSummaries = [] } = await call(GA, 'https://analyticsadmin.googleapis.com/v1beta/accountSummaries')
  const props = accountSummaries.flatMap(a => a.propertySummaries ?? [])
  if (props.length !== 1) throw new Error(`Set GA4_PROPERTY_ID: the account sees ${props.length} properties`)
  return props[0].property.replace('properties/', '')
}

const eventFilter = names => ({
  filter: { fieldName: 'eventName', inListFilter: { values: names } },
})

async function realtime() {
  const property = `properties/${await propertyId()}`
  const names = Object.keys(EVENTS)

  // Arrival: event counts over the last 30 minutes (realtime's window).
  const arrived = await gaData(`${property}:runRealtimeReport`, {
    dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }], dimensionFilter: eventFilter(names),
  })
  const counts = Object.fromEntries((arrived.rows ?? []).map(r => [r.dimensionValues[0].value, r.metricValues[0].value]))
  console.log('Realtime, last 30 minutes')
  for (const n of names) console.log(`  ${n.padEnd(16)} ${counts[n] ?? 0}`)

  // Parameters: realtime reports take only user-scoped custom dimensions, so event parameter
  // values come from today's (intraday) standard report, which needs each parameter
  // registered as a custom dimension and fills from registration onwards.
  const meta = await gaData(`${property}/metadata`)
  const available = new Set(meta.dimensions.map(d => d.apiName))
  const today = new Date().toISOString().slice(0, 10)
  console.log(`\nParameters, today (${today}) — intraday data can lag a few hours`)
  for (const [event, params] of Object.entries(EVENTS)) {
    console.log(`  ${event}`)
    for (const p of params) {
      const dim = [`customEvent:${p}`, BUILT_IN[p]].find(d => d && available.has(d))
      if (!dim) { console.log(`    ${p.padEnd(14)} not registered as a custom dimension`); continue }
      const report = await gaData(`${property}:runReport`, {
        dateRanges: [{ startDate: 'today', endDate: 'today' }],
        dimensions: [{ name: dim }], metrics: [{ name: 'eventCount' }],
        dimensionFilter: eventFilter([event]), limit: 5,
      })
      const values = (report.rows ?? []).map(r => `${r.dimensionValues[0].value} (${r.metricValues[0].value})`)
      console.log(`    ${p.padEnd(14)} ${values.join(', ') || 'no events yet'}`)
    }
  }
}

// ---- Search Console ----

const SC = 'https://www.googleapis.com/auth/webmasters.readonly'
const DAY = 86_400_000
const ymd = d => d.toISOString().slice(0, 10)

async function siteUrl() {
  const { siteEntry = [] } = await call(SC, 'https://www.googleapis.com/webmasters/v3/sites')
  const urls = siteEntry.map(s => s.siteUrl)
  const site = ['sc-domain:propilotlicence.com', `${SITE}/`, 'https://propilotlicence.com/'].find(u => urls.includes(u))
  if (!site) throw new Error(`No Search Console access to propilotlicence.com (the account sees: ${urls.join(', ') || 'nothing'})`)
  return site
}

async function trackedPages() {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).filter(u => TRACKED.test(new URL(u).pathname))
}

const csvCell = v => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v))

async function baseline() {
  const site = await siteUrl()
  const query = body => call(SC, `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, body)
  // Search Console data settles after 2–3 days, so the 28 days end 3 days ago.
  const end = new Date(Date.now() - 3 * DAY)
  const range = { startDate: ymd(new Date(end.getTime() - 27 * DAY)), endDate: ymd(end) }
  const onPage = page => [{ filters: [{ dimension: 'page', operator: 'equals', expression: page }] }]

  const rows = []
  for (const page of await trackedPages()) {
    const [total, queries] = await Promise.all([
      query({ ...range, dimensions: ['page'], dimensionFilterGroups: onPage(page) }),
      query({ ...range, dimensions: ['query'], dimensionFilterGroups: onPage(page), rowLimit: 20 }),
    ])
    const t = total.rows?.[0]
    rows.push({ kind: 'page', page, query: '', clicks: t?.clicks ?? 0, impressions: t?.impressions ?? 0, ctr: t?.ctr ?? 0, position: t?.position ?? '' })
    for (const q of queries.rows ?? []) {
      rows.push({ kind: 'query', page, query: q.keys[0], clicks: q.clicks, impressions: q.impressions, ctr: q.ctr, position: q.position })
    }
  }

  const header = ['start_date', 'end_date', 'kind', 'page', 'query', 'clicks', 'impressions', 'ctr', 'position']
  const lines = rows.map(r => [
    range.startDate, range.endDate, r.kind, r.page.replace(SITE, ''), r.query, r.clicks, r.impressions,
    (r.ctr * 100).toFixed(2), r.position === '' ? '' : r.position.toFixed(1),
  ].map(csvCell).join(','))
  mkdirSync(OUT_DIR, { recursive: true })
  const file = join(OUT_DIR, `search-console-${ymd(new Date())}.csv`)
  writeFileSync(file, [header.join(','), ...lines].join('\n') + '\n')

  console.log(`Search Console (${site}), ${range.startDate} to ${range.endDate}`)
  console.log('clicks  impr   ctr%   pos   page')
  for (const r of rows.filter(r => r.kind === 'page')) {
    console.log(`${String(r.clicks).padStart(6)} ${String(r.impressions).padStart(5)} ${(r.ctr * 100).toFixed(1).padStart(6)} ${(r.position === '' ? '–' : r.position.toFixed(1)).padStart(5)}   ${r.page.replace(SITE, '')}`)
  }
  console.log(`\nSaved ${file}`)
}

const command = process.argv[2]
const run = { realtime, baseline }[command]
if (!run) {
  console.error('Usage: node scripts/analytics/report.mjs realtime|baseline [--property=<GA4 property id>]')
  process.exit(1)
}
run().catch(e => { console.error(e.message); process.exit(1) })
