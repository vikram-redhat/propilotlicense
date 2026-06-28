'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

interface Props {
  name: string | null
  isLoggedIn: boolean
  subscribed?: boolean
}

export default function LandingHeader({ name, isLoggedIn, subscribed }: Props) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const firstName = (name || 'Account').split(' ')[0]

  return (
    <>
      <nav style={{ position: 'sticky', top: 0, zIndex: 200, background: '#F8FAFF', borderBottom: '1px solid #D4E1F0' }}>
        <div className="px-5 sm:px-9 lg:px-[60px]" style={{ height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', fontFamily: 'var(--font-outfit),sans-serif', fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px', color: '#0D1B2E', userSelect: 'none', flexShrink: 0 }}>
            ProPilot<span style={{ color: '#EF9F27' }}>Licence</span>
          </Link>

          {/* Desktop nav links (sm+) */}
          <div className="hidden sm:flex" style={{ gap: 22, alignItems: 'center' }}>
            <Link href="/cpl" style={{ fontSize: 13, fontWeight: 500, color: '#4A5E78', textDecoration: 'none' }}>Subjects</Link>
            <Link href="/profile" style={{ fontSize: 13, fontWeight: 500, color: '#4A5E78', textDecoration: 'none' }}>My Progress</Link>
            <Link href="/cpl" style={{ fontSize: 13, fontWeight: 500, color: '#4A5E78', textDecoration: 'none' }}>Mock Exams</Link>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

            {/* Desktop: palette + auth (sm+) */}
            <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 8 }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 20, border: '1px solid #D4E1F0', background: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#4A5E78', letterSpacing: '0.3px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF9F27', flexShrink: 0, display: 'block' }}/>
                Runway Blue
              </button>

              {isLoggedIn && !subscribed && (
                <Link href="/pricing" style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 20, border: '1px solid #D4E1F0', color: '#EF9F27', textDecoration: 'none', letterSpacing: '0.2px' }}>Upgrade</Link>
              )}

              {isLoggedIn ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    style={{ fontSize: 13, fontWeight: 500, color: '#185FA5', background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px 4px', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    Hi, {firstName}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {userMenuOpen && (
                    <div style={{ position: 'absolute', right: 0, marginTop: 8, width: 176, background: '#fff', borderRadius: 12, border: '1px solid #D4E1F0', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden', zIndex: 50 }}>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#0D1B2E', textDecoration: 'none' }}>Profile</Link>
                      <Link href="/cpl" onClick={() => setUserMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#0D1B2E', textDecoration: 'none', borderTop: '1px solid #EEF3FA' }}>Subjects</Link>
                      <button onClick={signOut} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 14, color: '#0D1B2E', background: 'transparent', border: 'none', borderTop: '1px solid #EEF3FA', cursor: 'pointer' }}>Sign out</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: '#185FA5', textDecoration: 'none', padding: '5px 4px' }}>Log in</Link>
              )}
            </div>

            {/* Mobile: hamburger (hidden sm+) */}
            <button
              className="flex sm:hidden"
              onClick={() => setDrawerOpen(o => !o)}
              aria-label="Open menu"
              style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
                <path d="M1 2h18M1 8h18M1 14h18" stroke="#0D1B2E" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer + backdrop */}
      {drawerOpen && (
        <>
          <div
            style={{
              position: 'fixed', top: 54, left: 0, right: 0, zIndex: 190,
              background: '#F8FAFF', borderBottom: '1px solid #D4E1F0',
              padding: '8px 20px 20px',
              animation: 'slideDown 0.22s cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/cpl" onClick={() => setDrawerOpen(false)} style={{ padding: '13px 0', fontSize: 16, fontWeight: 500, color: '#0D1B2E', textDecoration: 'none', borderBottom: '1px solid #D4E1F0', display: 'block' }}>Subjects</Link>
              <Link href="/profile" onClick={() => setDrawerOpen(false)} style={{ padding: '13px 0', fontSize: 16, fontWeight: 500, color: '#0D1B2E', textDecoration: 'none', borderBottom: '1px solid #D4E1F0', display: 'block' }}>My Progress</Link>
              <Link href="/cpl" onClick={() => setDrawerOpen(false)} style={{ padding: '13px 0', fontSize: 16, fontWeight: 500, color: '#0D1B2E', textDecoration: 'none', display: 'block' }}>Mock Exams</Link>
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #D4E1F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 13px', borderRadius: 20, border: '1px solid #D4E1F0', background: 'transparent', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#4A5E78' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF9F27', flexShrink: 0, display: 'block' }}/>
                Runway Blue
              </button>
              {isLoggedIn ? (
                <button onClick={signOut} style={{ fontSize: 14, fontWeight: 500, color: '#185FA5', background: 'transparent', border: 'none', cursor: 'pointer' }}>Sign out</button>
              ) : (
                <Link href="/login" onClick={() => setDrawerOpen(false)} style={{ fontSize: 14, fontWeight: 500, color: '#185FA5', textDecoration: 'none' }}>Log in</Link>
              )}
            </div>
          </div>
          <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 180, background: 'rgba(0,0,0,0.22)' }} />
        </>
      )}
    </>
  )
}
