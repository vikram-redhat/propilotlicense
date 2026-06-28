'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import UserMenu from './UserMenu'

export default function HeaderAuth() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getUser().then(({ data: { user } }) => {
      setLoggedIn(!!user)
    })
  }, [])

  // null = still loading, render nothing to avoid flash
  if (loggedIn === null) return null

  if (loggedIn) return <UserMenu />

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: '#4A5E78', textDecoration: 'none', padding: '5px 4px' }}>Log in</Link>
      <Link href="/signup" style={{ fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 8, background: '#185FA5', color: '#fff', textDecoration: 'none' }}>Sign up</Link>
    </div>
  )
}
