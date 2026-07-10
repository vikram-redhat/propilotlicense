'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useTheme } from '@/components/ThemeProvider'
import { GUIDE_SERIES } from '@/lib/guides'

interface Props {
  name: string | null
  isLoggedIn: boolean
  subscribed?: boolean
  examType?: string | null
}

export default function LandingHeader({ name: initialName, isLoggedIn: initialIsLoggedIn, subscribed, examType }: Props) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [guidesMenuOpen, setGuidesMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const guidesMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Some pages (statically generated ones, or ones that just haven't been wired up)
  // pass isLoggedIn/name as a hardcoded or build-time value rather than the real
  // per-request session. Treat the prop as an initial hint only, and verify the
  // actual session client-side — this is the single place that guarantees the
  // header reflects who's really logged in, regardless of what any page passed in.
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn)
  const [name, setName] = useState(initialName)

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
      setName(user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? null)
    })
  }, [supabase])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
      if (guidesMenuRef.current && !guidesMenuRef.current.contains(e.target as Node)) setGuidesMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const { palette, toggle: togglePalette } = useTheme()
  const firstName = (name || 'Account').split(' ')[0]
  const dashHref = examType === 'ATPL' ? '/atpl' : '/cpl'

  return (
    <>
      <nav style={{ position: 'sticky', top: 0, zIndex: 200, background: 'var(--clr-surface)', borderBottom: '1px solid var(--clr-border)' }}>
        <div className="px-5 sm:px-9 lg:px-[60px]" style={{ height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', fontFamily: 'var(--font-outfit),sans-serif', fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px', color: 'var(--clr-text)', userSelect: 'none', flexShrink: 0 }}>
            ProPilot<span style={{ color: 'var(--clr-amber)' }}>Licence</span>
          </Link>

          {/* Desktop nav links (sm+) */}
          <div className="hidden sm:flex" style={{ gap: 22, alignItems: 'center' }}>
            <Link href="/subjects" style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-text-med)', textDecoration: 'none' }}>Subjects</Link>
            <div className="relative" ref={guidesMenuRef}>
              <button
                onClick={() => setGuidesMenuOpen(o => !o)}
                style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-text-med)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                Guides
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {guidesMenuOpen && (
                <div style={{ position: 'absolute', left: 0, marginTop: 12, width: 200, background: '#fff', borderRadius: 12, border: '1px solid var(--clr-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden', zIndex: 50 }}>
                  {GUIDE_SERIES.map((series, i) => (
                    <Link
                      key={series.slug}
                      href={`/guides/${series.slug}`}
                      onClick={() => setGuidesMenuOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: 'var(--clr-text)', textDecoration: 'none', borderTop: i > 0 ? '1px solid var(--clr-surf-alt)' : 'none' }}
                    >
                      {series.navLabel}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/about" style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-text-med)', textDecoration: 'none' }}>About</Link>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

            {/* Palette toggle — desktop only */}
            <button
              className="hidden sm:flex"
              onClick={togglePalette}
              style={{ alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 20, border: '1px solid var(--clr-border)', background: 'transparent', fontSize: 11, fontWeight: 600, color: 'var(--clr-text-med)', cursor: 'pointer', flexShrink: 0 }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--clr-amber)', flexShrink: 0 }} />
              {palette === 'A' ? 'Runway Blue' : 'Golden Hour'}
            </button>

            {/* Desktop: auth (sm+) */}
            <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 8 }}>
              {isLoggedIn && !subscribed && (
                <Link href="/pricing" style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 20, border: '1px solid var(--clr-border)', color: 'var(--clr-amber)', textDecoration: 'none', letterSpacing: '0.2px' }}>Upgrade</Link>
              )}

              {isLoggedIn ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-primary)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px 4px', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    Hi, {firstName}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {userMenuOpen && (
                    <div style={{ position: 'absolute', right: 0, marginTop: 8, width: 176, background: '#fff', borderRadius: 12, border: '1px solid var(--clr-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden', zIndex: 50 }}>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: 'var(--clr-text)', textDecoration: 'none' }}>Profile</Link>
                      <Link href={dashHref} onClick={() => setUserMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: 'var(--clr-text)', textDecoration: 'none', borderTop: '1px solid var(--clr-surf-alt)' }}>Mock Exams</Link>
                      <button onClick={signOut} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 14, color: 'var(--clr-text)', background: 'transparent', border: 'none', borderTop: '1px solid var(--clr-surf-alt)', cursor: 'pointer' }}>Sign out</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-text-med)', textDecoration: 'none', padding: '5px 4px' }}>Log in</Link>
                  <Link href="/signup" style={{ fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 8, background: 'var(--clr-primary)', color: '#fff', textDecoration: 'none' }}>Sign up</Link>
                </>
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
                <path d="M1 2h18M1 8h18M1 14h18" stroke="var(--clr-text)" strokeWidth="2" strokeLinecap="round"/>
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
              background: 'var(--clr-surface)', borderBottom: '1px solid var(--clr-border)',
              padding: '8px 20px 20px',
              animation: 'slideDown 0.22s cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/subjects" onClick={() => setDrawerOpen(false)} style={{ padding: '13px 0', fontSize: 16, fontWeight: 500, color: 'var(--clr-text)', textDecoration: 'none', borderBottom: '1px solid var(--clr-border)', display: 'block' }}>Subjects</Link>
              <Link href="/guides" onClick={() => setDrawerOpen(false)} style={{ padding: '13px 0', fontSize: 16, fontWeight: 500, color: 'var(--clr-text)', textDecoration: 'none', borderBottom: '1px solid var(--clr-border)', display: 'block' }}>Guides</Link>
              <Link href="/about" onClick={() => setDrawerOpen(false)} style={{ padding: '13px 0', fontSize: 16, fontWeight: 500, color: 'var(--clr-text)', textDecoration: 'none', borderBottom: isLoggedIn ? '1px solid var(--clr-border)' : 'none', display: 'block' }}>About</Link>
              {isLoggedIn && (
                <>
                  <Link href="/profile" onClick={() => setDrawerOpen(false)} style={{ padding: '13px 0', fontSize: 16, fontWeight: 500, color: 'var(--clr-text)', textDecoration: 'none', borderBottom: '1px solid var(--clr-border)', display: 'block' }}>Profile</Link>
                  <Link href={dashHref} onClick={() => setDrawerOpen(false)} style={{ padding: '13px 0', fontSize: 16, fontWeight: 500, color: 'var(--clr-text)', textDecoration: 'none', display: 'block' }}>Mock Exams</Link>
                </>
              )}
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Palette toggle — mobile */}
              <button
                onClick={togglePalette}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 20, border: '1px solid var(--clr-border)', background: 'transparent', fontSize: 11, fontWeight: 600, color: 'var(--clr-text-med)', cursor: 'pointer' }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--clr-amber)', flexShrink: 0 }} />
                {palette === 'A' ? 'Runway Blue' : 'Golden Hour'}
              </button>

              {isLoggedIn ? (
                <button onClick={signOut} style={{ fontSize: 14, fontWeight: 500, color: 'var(--clr-primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Sign out</button>
              ) : (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Link href="/login" onClick={() => setDrawerOpen(false)} style={{ fontSize: 14, fontWeight: 500, color: 'var(--clr-text-med)', textDecoration: 'none' }}>Log in</Link>
                  <Link href="/signup" onClick={() => setDrawerOpen(false)} style={{ fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 8, background: 'var(--clr-primary)', color: '#fff', textDecoration: 'none' }}>Sign up</Link>
                </div>
              )}
            </div>
          </div>
          <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 180, background: 'rgba(0,0,0,0.22)' }} />
        </>
      )}
    </>
  )
}
