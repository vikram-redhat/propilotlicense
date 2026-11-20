// IndexNow (Bing, Yandex and the other participating engines). The key is public by
// design: search engines check it against public/<key>.txt, which proxy.ts lets through.
export const INDEXNOW_KEY = '29e9c05ffe8dd10b6f1ccfdca194e402'
export const INDEXNOW_KEY_PATH = `/${INDEXNOW_KEY}.txt`

const HOST = 'www.propilotlicence.com'
const ENDPOINTS = ['https://www.bing.com/indexnow', 'https://yandex.com/indexnow']

// Pings each endpoint with the URLs (absolute, on www.propilotlicence.com). Never throws:
// returns one line per endpoint, the HTTP status or the error.
export async function pingIndexNow(urls: string[]): Promise<string[]> {
  const body = JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: `https://${HOST}${INDEXNOW_KEY_PATH}`, urlList: urls })
  return Promise.all(ENDPOINTS.map(async endpoint => {
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body, signal: AbortSignal.timeout(10_000) })
      return `${endpoint}: ${res.status} for ${urls.length} URL(s)`
    } catch (e) {
      return `${endpoint}: ${(e as Error).message}`
    }
  }))
}
