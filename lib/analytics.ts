// GA4 custom events, sent with gtag. Client-side only.
//
// No personal data in any event: no names, emails, phone numbers or user ids. Page paths
// are sent without query strings or fragments (pathOnly), so nothing typed into a URL
// leaks through. Events are sent only when NEXT_PUBLIC_GA_ID is set, so dev and preview
// builds send nothing — same rule as components/GoogleAnalytics.tsx.

type EventParams = Record<string, string | number | boolean | undefined | Record<string, unknown>[]>

declare global {
  interface Window {
    gaReady?: boolean
  }
}

// gtag.js drops an event queued before its 'config' command (no destination yet), so
// wait for the init script (GoogleAnalytics.tsx) to set window.gaReady.
export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_GA_ID) return
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
  let tries = 0
  const send = () => {
    if (window.gaReady && typeof window.gtag === 'function') window.gtag('event', name, clean)
    else if (++tries < 50) setTimeout(send, 200) // up to 10 s
  }
  send()
}

// "/books/x?next=…#y" → "/books/x"; anything that isn't a site path → undefined.
export function pathOnly(path: string | null | undefined): string | undefined {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return undefined
  return path.split(/[?#]/)[0] || '/'
}

// The previous page's path, if it was on this site.
export function referrerPath(): string | undefined {
  if (typeof document === 'undefined' || !document.referrer) return undefined
  try {
    const url = new URL(document.referrer)
    return url.origin === window.location.origin ? pathOnly(url.pathname) : undefined
  } catch {
    return undefined
  }
}

// Score bands for practice_complete — never the exact score.
export function scoreBand(percent: number): '0-49' | '50-74' | '75-100' {
  return percent < 50 ? '0-49' : percent < 75 ? '50-74' : '75-100'
}

// The auth callback (a server redirect) can't call gtag, so it leaves a short-lived
// cookie that GoogleAnalytics.tsx turns into a sign_up or login event on the next page.
export const AUTH_EVENT_COOKIE = 'ga_auth_event'
export type AuthEvent = { event: 'sign_up' | 'login'; method: string; from?: string }
