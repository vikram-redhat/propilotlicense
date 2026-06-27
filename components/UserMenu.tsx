'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function UserMenu() {
  const [name, setName]       = useState<string | null>(null)
  const [open, setOpen]       = useState(false)
  const menuRef               = useRef<HTMLDivElement>(null)
  const router                = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const display = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Account'
      setName((display as string).split(' ')[0])
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
        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        Hi, {name}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-50">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Profile
          </Link>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
          >
            Home
          </Link>
          <button
            onClick={signOut}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
