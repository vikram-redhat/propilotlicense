'use client'
import Script from 'next/script'
import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

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

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  // No id (dev / preview without the var set) → render nothing, so those
  // environments never send data to the production GA4 property.
  if (!gaId) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { send_page_view: false });`}
      </Script>
      <Suspense fallback={null}>
        <PageView gaId={gaId} />
      </Suspense>
    </>
  )
}
