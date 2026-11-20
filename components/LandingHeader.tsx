'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useTheme } from '@/components/ThemeProvider'
import { IconPalette } from '@tabler/icons-react'
import { GUIDE_SERIES } from '@/lib/guides'
import { hubForExamType } from '@/lib/hub'
import UpdatesBar from '@/components/UpdatesBar'

// The Subjects menu lists the public subjects (lib/public-subjects.ts, through
// /api/public-subjects), so a subject hidden from the homepage is hidden here too. Until
// that answers, it shows the subjects that have pages.
type NavSubject = { key: string; title: string; href: string; hrefLoggedIn: string }
const DEFAULT_SUBJECTS: NavSubject[] = [
  ['MET', 'Aviation Meteorology', '/subjects/aviation-meteorology'],
  ['REG', 'Air Regulations', '/subjects/air-regulations'],
  ['HP', 'Human Performance and Limitations', '/subjects/human-performance'],
  ['NAV', 'Air Navigation', '/subjects/air-navigation'],
  ['TECH', 'Technical General', '/subjects/technical-general'],
  ['RADIOAIDSINSTRUMENTS', 'Radio Aids and Instruments', '/subjects/radio-aids-instruments'],
].map(([key, title, href]) => ({ key, title, href, hrefLoggedIn: href }))
  .concat({ key: 'A320FAMILY', title: 'Airbus A320', href: '/guides/a320-systems', hrefLoggedIn: '/atpl' })
// The DGCA Updates menu: what's changing at DGCA now (the hub is /dgca-updates).
const NAV_UPDATES = [
  { label: 'Exam dates and centres', href: '/guides/dgca-exam-guides/dgca-exam-dates' },
  { label: 'Exam results', href: '/guides/dgca-exam-guides/dgca-exam-results' },
  { label: 'New rules from 2027', href: '/guides/dgca-exam-guides/bharatiya-vayuyan-niyam-2026' },
  { label: 'The 2024 Act', href: '/guides/dgca-exam-guides/bharatiya-vayuyan-adhiniyam-2024' },
]
const NAV_BOOKS = [
  { label: 'IC Joshi, Aviation Meteorology', href: '/books/ic-joshi-aviation-meteorology' },
  { label: 'RK Bali, Air Regulations', href: '/books/rk-bali-air-regulations' },
]
// Fetched once per page load, shared by every header on the page.
let navSubjects: Promise<NavSubject[]> | null = null
function loadNavSubjects() {
  navSubjects ??= fetch('/api/public-subjects')
    .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .catch(() => { navSubjects = null; return DEFAULT_SUBJECTS })
  return navSubjects
}

const menuLink = { display: 'block', padding: '10px 16px', fontSize: 14, color: 'var(--clr-text)', textDecoration: 'none', borderTop: '1px solid var(--clr-surf-alt)' } as const
const drawerLink = { padding: '13px 0', fontSize: 16, fontWeight: 500, color: 'var(--clr-text)', textDecoration: 'none', borderBottom: '1px solid var(--clr-border)', display: 'block' } as const
const drawerSubLink = { padding: '10px 0 10px 14px', fontSize: 15, color: 'var(--clr-text)', textDecoration: 'none', display: 'block' } as const
const drawerToggle = { ...drawerLink, width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--clr-border)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as const

function Chevron({ size = 11, open = false }: { size?: number; open?: boolean }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s' }}><path d="M6 9l6 6 6-6"/></svg>
}

interface Props {
  name: string | null
  isLoggedIn: boolean
  subscribed?: boolean
  examType?: string | null
}

export default function LandingHeader({ name: initialName, isLoggedIn: initialIsLoggedIn, subscribed, examType }: Props) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [guidesMenuOpen, setGuidesMenuOpen] = useState(false)
  const [subjectsMenuOpen, setSubjectsMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerSection, setDrawerSection] = useState<'subjects' | 'guides' | 'updates' | null>(null)
  const [updatesMenuOpen, setUpdatesMenuOpen] = useState(false)
  const [subjects, setSubjects] = useState<NavSubject[]>(DEFAULT_SUBJECTS)
  const menuRef = useRef<HTMLDivElement>(null)
  const guidesMenuRef = useRef<HTMLDivElement>(null)
  const updatesMenuRef = useRef<HTMLDivElement>(null)
  const subjectsMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Some pages (statically generated ones, or ones that just haven't been wired up)
  // pass isLoggedIn/name as a hardcoded or build-time value rather than the real
  // per-request session. Treat the prop as an initial hint only, and verify the
  // actual session client-side — this is the single place that guarantees the
  // header reflects who's really logged in, regardless of what any page passed in.
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn)
  const [name, setName] = useState(initialName)
  const [examTypeState, setExamTypeState] = useState(examType)

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
      setName(user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? null)
      // Self-correct exam type too: static pages (subjects/[subject], books/[book])
      // can't pass it per-request, so the prop is often absent — without this an
      // ATPL user's hub link would default to /cpl.
      if (user) setExamTypeState((user.user_metadata?.exam_type as string | undefined) ?? null)
    })
  }, [supabase])

  useEffect(() => {
    let live = true
    loadNavSubjects().then(list => { if (live) setSubjects(list) })
    return () => { live = false }
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (subjectsMenuRef.current && !subjectsMenuRef.current.contains(e.target as Node)) setSubjectsMenuOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
      if (guidesMenuRef.current && !guidesMenuRef.current.contains(e.target as Node)) setGuidesMenuOpen(false)
      if (updatesMenuRef.current && !updatesMenuRef.current.contains(e.target as Node)) setUpdatesMenuOpen(false)
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
  const dashHref = hubForExamType(examTypeState)
  const themeLabel = `Theme: ${palette === 'A' ? 'Runway Blue' : 'Golden Hour'}`
  const closeDrawer = () => { setDrawerOpen(false); setDrawerSection(null) }

  return (
    <>
      <nav style={{ position: 'sticky', top: 0, zIndex: 200, background: 'var(--clr-surface)', borderBottom: '1px solid var(--clr-border)' }}>
        <div className="px-5 sm:px-9 lg:px-[60px]" style={{ height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', fontFamily: 'var(--font-outfit),sans-serif', fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px', color: 'var(--clr-text)', userSelect: 'none', flexShrink: 0 }}>
            ProPilot<span style={{ color: 'var(--clr-amber)' }}>Licence</span>
          </Link>

          {/* Desktop nav links (lg+, 1024px; below that the drawer: with DGCA Updates the row needs
              about 790px logged in, more than the 768px it used to start at) */}
          <div className="hidden lg:flex" style={{ gap: 22, alignItems: 'center' }}>
            <div className="relative" ref={subjectsMenuRef}>
              <button
                onClick={() => { setSubjectsMenuOpen(o => !o); setGuidesMenuOpen(false); setUpdatesMenuOpen(false) }}
                aria-expanded={subjectsMenuOpen}
                style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-text-med)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                Subjects
                <Chevron />
              </button>
                <div hidden={!subjectsMenuOpen} style={{ position: 'absolute', left: 0, marginTop: 12, width: 280, background: '#fff', borderRadius: 12, border: '1px solid var(--clr-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden', zIndex: 50 }}>
                  <Link href="/subjects" data-cta="nav-subjects" onClick={() => setSubjectsMenuOpen(false)} style={{ ...menuLink, fontWeight: 600, borderTop: 'none' }}>
                    All subjects
                  </Link>
                  {subjects.map(sub => (
                    <Link key={sub.key} href={isLoggedIn ? sub.hrefLoggedIn : sub.href} data-cta="nav-subjects" onClick={() => setSubjectsMenuOpen(false)} style={menuLink}>
                      {sub.title}
                    </Link>
                  ))}
                  <div style={{ padding: '10px 16px 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--clr-text-med)', borderTop: '1px solid var(--clr-border)' }}>
                    Books
                  </div>
                  {NAV_BOOKS.map(b => (
                    <Link key={b.href} href={b.href} data-cta="nav-subjects" onClick={() => setSubjectsMenuOpen(false)} style={{ ...menuLink, borderTop: 'none' }}>
                      {b.label}
                    </Link>
                  ))}
                </div>
            </div>
            <div className="relative" ref={guidesMenuRef}>
              <button
                onClick={() => { setGuidesMenuOpen(o => !o); setSubjectsMenuOpen(false); setUpdatesMenuOpen(false) }}
                aria-expanded={guidesMenuOpen}
                style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-text-med)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                Guides
                <Chevron />
              </button>
                <div hidden={!guidesMenuOpen} style={{ position: 'absolute', left: 0, marginTop: 12, width: 200, background: '#fff', borderRadius: 12, border: '1px solid var(--clr-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden', zIndex: 50 }}>
                  <Link
                    href="/guides"
                    onClick={() => setGuidesMenuOpen(false)}
                    style={{ display: 'block', padding: '10px 16px', fontSize: 14, fontWeight: 600, color: 'var(--clr-text)', textDecoration: 'none' }}
                  >
                    All guides
                  </Link>
                  {GUIDE_SERIES.map((series) => (
                    <Link
                      key={series.slug}
                      href={`/guides/${series.slug}`}
                      onClick={() => setGuidesMenuOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: 'var(--clr-text)', textDecoration: 'none', borderTop: '1px solid var(--clr-surf-alt)' }}
                    >
                      {series.navLabel}
                    </Link>
                  ))}
                </div>
            </div>
            <div className="relative" ref={updatesMenuRef}>
              <button
                onClick={() => { setUpdatesMenuOpen(o => !o); setSubjectsMenuOpen(false); setGuidesMenuOpen(false) }}
                aria-expanded={updatesMenuOpen}
                style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-text-med)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}
              >
                DGCA Updates
                <Chevron />
              </button>
                <div hidden={!updatesMenuOpen} style={{ position: 'absolute', left: 0, marginTop: 12, width: 230, background: '#fff', borderRadius: 12, border: '1px solid var(--clr-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden', zIndex: 50 }}>
                  {NAV_UPDATES.map((u, i) => (
                    <Link key={u.href} href={u.href} data-cta="nav-updates" onClick={() => setUpdatesMenuOpen(false)} style={{ ...menuLink, ...(i === 0 ? { borderTop: 'none' } : {}) }}>
                      {u.label}
                    </Link>
                  ))}
                  <Link href="/dgca-updates" data-cta="nav-updates" onClick={() => setUpdatesMenuOpen(false)} style={{ ...menuLink, fontWeight: 600, borderTop: '1px solid var(--clr-border)' }}>
                    All DGCA updates
                  </Link>
                </div>
            </div>
            <Link href="/pricing" data-cta="nav-pricing" style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-text-med)', textDecoration: 'none' }}>Pricing</Link>
            <Link href="/about" style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-text-med)', textDecoration: 'none' }}>About</Link>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

            {/* Palette toggle — desktop only: an icon, named in its tooltip */}
            <button
              className="hidden lg:flex"
              onClick={togglePalette}
              aria-label={themeLabel}
              title={themeLabel}
              style={{ alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--clr-border)', background: 'transparent', color: 'var(--clr-amber)', cursor: 'pointer', padding: 0, flexShrink: 0 }}
            >
              <IconPalette size={16} aria-hidden="true" />
            </button>

            {/* Desktop: auth (lg+) */}
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 8 }}>
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
                      <Link href={dashHref} onClick={() => setUserMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: 'var(--clr-text)', textDecoration: 'none', borderTop: '1px solid var(--clr-surf-alt)' }}>Practice &amp; Mock Exams</Link>
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

            {/* Mobile and tablet: hamburger (hidden lg+) */}
            <button
              className="flex lg:hidden"
              onClick={() => (drawerOpen ? closeDrawer() : setDrawerOpen(true))}
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={drawerOpen}
              style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
                <path d="M1 2h18M1 8h18M1 14h18" stroke="var(--clr-text)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <UpdatesBar />

      {/* Mobile drawer + backdrop */}
      {drawerOpen && (
        <>
          <div
            style={{
              position: 'fixed', top: 54, left: 0, right: 0, zIndex: 190,
              background: 'var(--clr-surface)', borderBottom: '1px solid var(--clr-border)',
              padding: '8px 20px 20px', maxHeight: 'calc(100dvh - 54px)', overflowY: 'auto',
              animation: 'slideDown 0.22s cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => setDrawerSection(o => (o === 'subjects' ? null : 'subjects'))} aria-expanded={drawerSection === 'subjects'} style={drawerToggle}>
                Subjects <Chevron size={14} open={drawerSection === 'subjects'} />
              </button>
              {drawerSection === 'subjects' && (
                <div style={{ borderBottom: '1px solid var(--clr-border)', paddingBottom: 6 }}>
                  <Link href="/subjects" data-cta="nav-subjects" onClick={closeDrawer} style={{ ...drawerSubLink, fontWeight: 600 }}>All subjects</Link>
                  {subjects.map(sub => (
                    <Link key={sub.key} href={isLoggedIn ? sub.hrefLoggedIn : sub.href} data-cta="nav-subjects" onClick={closeDrawer} style={drawerSubLink}>{sub.title}</Link>
                  ))}
                  <div style={{ padding: '12px 0 4px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--clr-text-med)' }}>Books</div>
                  {NAV_BOOKS.map(b => (
                    <Link key={b.href} href={b.href} data-cta="nav-subjects" onClick={closeDrawer} style={drawerSubLink}>{b.label}</Link>
                  ))}
                </div>
              )}
              <button onClick={() => setDrawerSection(o => (o === 'guides' ? null : 'guides'))} aria-expanded={drawerSection === 'guides'} style={drawerToggle}>
                Guides <Chevron size={14} open={drawerSection === 'guides'} />
              </button>
              {drawerSection === 'guides' && (
                <div style={{ borderBottom: '1px solid var(--clr-border)', paddingBottom: 6 }}>
                  <Link href="/guides" onClick={closeDrawer} style={{ ...drawerSubLink, fontWeight: 600 }}>All guides</Link>
                  {GUIDE_SERIES.map(series => (
                    <Link key={series.slug} href={`/guides/${series.slug}`} onClick={closeDrawer} style={drawerSubLink}>{series.navLabel}</Link>
                  ))}
                </div>
              )}
              <button onClick={() => setDrawerSection(o => (o === 'updates' ? null : 'updates'))} aria-expanded={drawerSection === 'updates'} style={drawerToggle}>
                DGCA Updates <Chevron size={14} open={drawerSection === 'updates'} />
              </button>
              {drawerSection === 'updates' && (
                <div style={{ borderBottom: '1px solid var(--clr-border)', paddingBottom: 6 }}>
                  {NAV_UPDATES.map(u => (
                    <Link key={u.href} href={u.href} data-cta="nav-updates" onClick={closeDrawer} style={drawerSubLink}>{u.label}</Link>
                  ))}
                  <Link href="/dgca-updates" data-cta="nav-updates" onClick={closeDrawer} style={{ ...drawerSubLink, fontWeight: 600 }}>All DGCA updates</Link>
                </div>
              )}
              <Link href="/pricing" data-cta="nav-pricing" onClick={closeDrawer} style={drawerLink}>Pricing</Link>
              <Link href="/about" onClick={closeDrawer} style={{ ...drawerLink, borderBottom: isLoggedIn ? '1px solid var(--clr-border)' : 'none' }}>About</Link>
              {isLoggedIn && (
                <>
                  <Link href="/profile" onClick={closeDrawer} style={drawerLink}>Profile</Link>
                  <Link href={dashHref} onClick={closeDrawer} style={{ ...drawerLink, borderBottom: 'none' }}>Practice &amp; Mock Exams</Link>
                </>
              )}
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Palette toggle — mobile */}
              <button
                onClick={togglePalette}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 20, border: '1px solid var(--clr-border)', background: 'transparent', fontSize: 11, fontWeight: 600, color: 'var(--clr-text-med)', cursor: 'pointer' }}
              >
                <IconPalette size={14} aria-hidden="true" style={{ color: 'var(--clr-amber)' }} />
                {themeLabel}
              </button>

              {isLoggedIn ? (
                <button onClick={signOut} style={{ fontSize: 14, fontWeight: 500, color: 'var(--clr-primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Sign out</button>
              ) : (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Link href="/login" onClick={closeDrawer} style={{ fontSize: 14, fontWeight: 500, color: 'var(--clr-text-med)', textDecoration: 'none' }}>Log in</Link>
                  <Link href="/signup" onClick={closeDrawer} style={{ fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 8, background: 'var(--clr-primary)', color: '#fff', textDecoration: 'none' }}>Sign up</Link>
                </div>
              )}
            </div>
          </div>
          <div onClick={closeDrawer} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 180, background: 'rgba(0,0,0,0.22)' }} />
        </>
      )}
    </>
  )
}
