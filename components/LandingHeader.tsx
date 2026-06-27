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
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
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
    <nav style={{ position: 'sticky', top: 0, zIndex: 200, background: '#F8FAFF', borderBottom: '1px solid #D4E1F0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'var(--font-outfit),sans-serif', fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px', color: '#0D1B2E', userSelect: 'none', flexShrink: 0 }}>
          ProPilot<span style={{ color: '#EF9F27' }}>Licence</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex" style={{ gap: 22, alignItems: 'center' }}>
          <Link href="/cpl" style={{ fontSize: 13, fontWeight: 500, color: '#4A5E78', textDecoration: 'none' }}>Subjects</Link>
          <Link href="/profile" style={{ fontSize: 13, fontWeight: 500, color: '#4A5E78', textDecoration: 'none' }}>My Progress</Link>
          <Link href="/cpl" style={{ fontSize: 13, fontWeight: 500, color: '#4A5E78', textDecoration: 'none' }}>Mock Exams</Link>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {isLoggedIn && !subscribed && (
            <Link
              href="/pricing"
              style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 20, border: '1px solid #D4E1F0', color: '#EF9F27', textDecoration: 'none', letterSpacing: '0.2px' }}
            >
              Upgrade
            </Link>
          )}

          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{ fontSize: 13, fontWeight: 500, color: '#185FA5', background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px 4px', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                Hi, {firstName}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {menuOpen && (
                <div style={{ position: 'absolute', right: 0, marginTop: 8, width: 176, background: '#fff', borderRadius: 12, border: '1px solid #D4E1F0', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden', zIndex: 50 }}>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#0D1B2E', textDecoration: 'none' }}>Profile</Link>
                  <Link href="/cpl" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#0D1B2E', textDecoration: 'none', borderTop: '1px solid #EEF3FA' }}>Subjects</Link>
                  <button onClick={signOut} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 14, color: '#0D1B2E', background: 'transparent', border: 'none', borderTop: '1px solid #EEF3FA', cursor: 'pointer' }}>Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: '#185FA5', textDecoration: 'none', padding: '5px 4px' }}>Log in</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
