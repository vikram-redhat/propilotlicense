// Ping IndexNow (Bing, Yandex) with guide and chapter page URLs, so new and updated pages
// are recrawled quickly.
//
//   npx tsx scripts/indexnow.ts --changed   guides and chapter pages published or updated today (IST)
//   npx tsx scripts/indexnow.ts <url> ...   specific URLs
//
// `npm run build` runs --changed after `next build` on Vercel production builds only
// (VERCEL_ENV=production). It never fails the build: errors are logged and it exits 0.
import { GUIDE_SERIES, postHref } from '../lib/guides'
import { INDEXNOW_KEY, INDEXNOW_KEY_PATH } from '../lib/indexnow'
import { allChapterPages } from '../lib/chapter-pages'

const HOST = 'www.propilotlicence.com'
const ENDPOINTS = ['https://www.bing.com/indexnow', 'https://yandex.com/indexnow']

function changedUrls(): string[] {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) // YYYY-MM-DD
  const isNew = (p: { publishedAt: string; updatedAt: string }) => p.publishedAt === today || p.updatedAt === today
  return [
    ...GUIDE_SERIES.flatMap(series => series.posts.filter(isNew).map(p => `https://${HOST}${postHref(series, p)}`)),
    ...allChapterPages().filter(c => isNew(c.page)).map(c => `https://${HOST}/books/${c.bookSlug}/${c.page.slug}`),
  ]
}

async function ping(urls: string[]) {
  const body = JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: `https://${HOST}${INDEXNOW_KEY_PATH}`, urlList: urls })
  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body })
      console.log(`IndexNow ${endpoint}: ${res.status} for ${urls.length} URL(s)`)
    } catch (e) {
      console.error(`IndexNow ${endpoint}: ${(e as Error).message}`)
    }
  }
}

async function main() {
  const args = process.argv.slice(2)
  if (args[0] === '--changed') {
    if (process.env.VERCEL_ENV !== 'production') return console.log('IndexNow: not a production build, skipped')
    const urls = changedUrls()
    if (!urls.length) return console.log('IndexNow: no guides or chapter pages published or updated today')
    console.log('IndexNow:', urls.join(' '))
    return ping(urls)
  }
  if (!args.length) return console.error('Usage: --changed | <url> ...')
  return ping(args)
}

main().catch(e => console.error('IndexNow:', e))
