'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function UserMenu() {
  const [name, setName] = useState<string | null>(null)
  const [hubHref, setHubHref] = useState('/cpl')
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const display = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Account'
      setName((display as string).split(' ')[0])
      setHubHref(user.user_metadata?.exam_type === 'ATPL' ? '/atpl' : '/cpl')
    })

    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!name) return null

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-primary)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px 4px', display: 'flex', alignItems: 'center', gap: 4 }}
      >
        Hi, {name}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div style={{ position: 'absolute', right: 0, marginTop: 8, width: 176, background: '#fff', borderRadius: 12, border: '1px solid var(--clr-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden', zIndex: 50 }}>
          <Link href="/profile" onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: 'var(--clr-text)', textDecoration: 'none' }}
            className="hover:bg-[var(--clr-surf-alt)] transition-colors">Profile</Link>
          <Link href={hubHref} onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: 'var(--clr-text)', textDecoration: 'none', borderTop: '1px solid var(--clr-surf-alt)' }}
            className="hover:bg-[var(--clr-surf-alt)] transition-colors">Practice &amp; Mock Exams</Link>
          <button onClick={signOut} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 14, color: 'var(--clr-text)', background: 'transparent', border: 'none', borderTop: '1px solid var(--clr-surf-alt)', cursor: 'pointer' }}
            className="hover:bg-[var(--clr-surf-alt)] transition-colors">Sign out</button>
        </div>
      )}
    </div>
  )
}
