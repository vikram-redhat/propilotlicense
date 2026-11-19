'use client'
import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { todayInIndia } from '@/lib/dgca-exams'
import { updatesBarMessage } from '@/lib/dgca-updates'

// One line under the header on every public page (rendered by LandingHeader), saying what's
// current at DGCA: the first rule in lib/dgca-updates.ts that applies today in India. The
// message is worked out again in the browser, so a cached page still shows today's.
// Dismissible for the rest of the day (India time) per visitor; the inline script hides it
// before paint for a visitor who dismissed it today. Clicks are cta_click with
// cta_location "updates-bar" and cta_variant the rule number.
const KEY = 'dgcaUpdatesBarDismissed'
const HIDE_ATTR = 'data-updates-bar-dismissed'
const PRE_PAINT = `try{if(localStorage.getItem('${KEY}')===new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(new Date()))document.documentElement.setAttribute('${HIDE_ATTR}','')}catch(e){}`

// Today's dismissal, read from localStorage (an external store, so the server render and
// hydration both see "not dismissed"; the pre-paint script hides it before then).
const EVENT = 'dgca-updates-bar-dismissed'
let dismissedWithoutStorage = false
function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => { window.removeEventListener(EVENT, onChange); window.removeEventListener('storage', onChange) }
}
function dismissedToday(): boolean {
  if (dismissedWithoutStorage) return true
  try { return localStorage.getItem(KEY) === todayInIndia() } catch { return false }
}

export default function UpdatesBar() {
  // Worked out on each render from today's date in India, so a page cached yesterday still
  // shows today's message once it's in the browser.
  const message = updatesBarMessage(todayInIndia())
  const dismissed = useSyncExternalStore(subscribe, dismissedToday, () => false)

  function dismiss() {
    try { localStorage.setItem(KEY, todayInIndia()) } catch { dismissedWithoutStorage = true }
    document.documentElement.setAttribute(HIDE_ATTR, '')
    window.dispatchEvent(new Event(EVENT))
  }

  if (dismissed) return null
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
      <style>{`html[${HIDE_ATTR}] .updates-bar { display: none; }`}</style>
      <div
        className="updates-bar px-5 sm:px-9 lg:px-[60px]"
        style={{ background: 'var(--clr-amber-light)', borderBottom: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8, paddingBottom: 8 }}
      >
        <Link
          href={message.href}
          data-cta="updates-bar"
          data-cta-variant={String(message.rule)}
          suppressHydrationWarning
          style={{ flex: 1, minWidth: 0, fontSize: 14, lineHeight: 1.45, fontWeight: 600, color: 'var(--clr-text)', textDecoration: 'none' }}
        >
          {message.text}
        </Link>
        <button
          onClick={dismiss}
          aria-label="Dismiss for today"
          title="Dismiss for today"
          style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--clr-text-med)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
        >
          ×
        </button>
      </div>
    </>
  )
}
