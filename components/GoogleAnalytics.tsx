'use client'
import Script from 'next/script'
import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { AUTH_EVENT_COOKIE, pathOnly, trackEvent, type AuthEvent } from '@/lib/analytics'
import { supabase } from '@/lib/supabase'
import { isAdminUser } from '@/lib/roles'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

// Fires a GA4 page_view on every App Router navigation. Client-side route changes
// don't reload the page, so gtag's automatic page_view would miss them — we send
// them manually instead (config below sets send_page_view:false, so this also
// sends the initial view; exactly one per navigation, no double counting).
function PageView({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window.gtag !== 'function') return
    const query = searchParams.toString()
    const path = query ? `${pathname}?${query}` : pathname
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.origin + path,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}

// Nothing is sent for /admin pages or from a browser used by an admin account: gtag's own
// opt-out flag, window['ga-disable-<id>'], which it checks before every hit (page views and
// events). The init script sets it before the first hit, from the path and from
// ADMIN_KEY, which remembers that this browser has been signed in as an admin (so it stays
// excluded after signing out). This keeps it current on client-side navigation, and sets or
// clears ADMIN_KEY once the session is known.
const ADMIN_KEY = 'ga_exclude_admin'
const isAdminPath = (path: string) => path === '/admin' || path.startsWith('/admin/')

function AdminExclusion({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  useEffect(() => {
    const flag = `ga-disable-${gaId}`
    const w = window as unknown as Record<string, unknown>
    const apply = (admin: boolean) => { w[flag] = admin || isAdminPath(pathname) }
    let admin = false
    try { admin = localStorage.getItem(ADMIN_KEY) === '1' } catch { /* storage blocked */ }
    apply(admin)
    let live = true
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user
      if (!live || !user) return // signed out: keep what this browser was
      const isAdmin = isAdminUser(user)
      try { if (isAdmin) localStorage.setItem(ADMIN_KEY, '1'); else localStorage.removeItem(ADMIN_KEY) } catch { /* storage blocked */ }
      apply(isAdmin)
    })
    return () => { live = false }
  }, [gaId, pathname])
  return null
}

// Site-wide event plumbing that needs no per-page code:
// - sign_up / login after the auth callback, from the cookie it leaves (fires once, the
//   cookie is cleared as it's read)
// - cta_click for any link marked data-cta="<location>" (plus data-cta-variant="<v>" as
//   cta_variant, e.g. which updates-bar message was shown), including links inside
//   editorial HTML rendered with dangerouslySetInnerHTML
function SiteEvents() {
  useEffect(() => {
    const raw = document.cookie.split('; ').find(c => c.startsWith(`${AUTH_EVENT_COOKIE}=`))
    if (raw) {
      document.cookie = `${AUTH_EVENT_COOKIE}=; Max-Age=0; path=/`
      try {
        const e = JSON.parse(decodeURIComponent(raw.slice(AUTH_EVENT_COOKIE.length + 1))) as AuthEvent
        if (e.event === 'sign_up') trackEvent('sign_up', { method: e.method, signup_page: pathOnly(e.from) })
        else if (e.event === 'login') trackEvent('login', { method: e.method })
      } catch { /* malformed cookie: ignore */ }
    }

    function onClick(ev: MouseEvent) {
      const link = (ev.target as Element | null)?.closest?.('[data-cta]') as HTMLElement | null
      if (!link) return
      trackEvent('cta_click', {
        cta_location: link.dataset.cta,
        ...(link.dataset.ctaVariant ? { cta_variant: link.dataset.ctaVariant } : {}),
        page_path: pathOnly(window.location.pathname),
        link_url: pathOnly(link.getAttribute('href')),
      })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
  return null
}

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  // No id (dev / preview without the var set) → render nothing, so those
  // environments never send data to the production GA4 property.
  if (!gaId) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`try{if((localStorage.getItem('${ADMIN_KEY}')==='1'||/^\/admin(\/|$)/.test(location.pathname)))window['ga-disable-${gaId}']=true}catch(e){}
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { send_page_view: false });
window.gaReady = true;`}
      </Script>
      <SiteEvents />
      <Suspense fallback={null}>
        <AdminExclusion gaId={gaId} />
        <PageView gaId={gaId} />
      </Suspense>
    </>
  )
}
