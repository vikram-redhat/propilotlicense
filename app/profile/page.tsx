'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'
import { getSubscriptionStatus, daysRemaining } from '@/lib/subscription'

export default function ProfilePage() {
  const [user, setUser]       = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats]     = useState({ sessions: 0, totalAnswers: 0, correctAnswers: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const [sessionsRes, answersRes, profileRes] = await Promise.all([
        supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('session_answers').select('is_correct, session:sessions!inner(user_id)').eq('session.user_id', user.id),
        supabase.from('profiles').select('*').eq('id', user.id).single(),
      ])

      const answers = answersRes.data || []
      setStats({
        sessions: sessionsRes.count ?? 0,
        totalAnswers: answers.length,
        correctAnswers: answers.filter(a => a.is_correct).length,
      })
      setProfile(profileRes.data)
      setLoading(false)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const initial  = (user?.email?.[0] ?? 'U').toUpperCase()
  const avgScore = stats.totalAnswers > 0
    ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100)
    : null

  const status = getSubscriptionStatus(profile)
  const days   = daysRemaining(profile)
  const expiryDate = profile?.subscription_expires_at
    ? new Date(profile.subscription_expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#185FA5' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-slate-800">ProPilotLicence</span>
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600">← Back</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {/* Identity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            style={{ backgroundColor: '#185FA5' }}
          >
            {initial}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{user?.email}</p>
            <p className="text-sm text-slate-500 mt-0.5 capitalize">
              {status === 'active' ? 'Full access' : status === 'expired' ? 'Access expired' : 'Free plan'}
            </p>
          </div>
        </div>

        {/* Subscription */}
        {status === 'active' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <p className="font-semibold text-green-800">Full access active</p>
            <p className="text-sm text-green-600 mt-1">
              {days} {days === 1 ? 'day' : 'days'} remaining · Expires {expiryDate}
            </p>
          </div>
        )}

        {status === 'expired' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="font-semibold text-amber-800">Your access has expired</p>
            <p className="text-sm text-amber-600 mt-1">You&apos;re back on the free plan.</p>
            <Link
              href="/pricing"
              className="inline-block mt-3 text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all hover:opacity-90"
              style={{ backgroundColor: '#185FA5' }}
            >
              Renew access →
            </Link>
          </div>
        )}

        {status === 'free' && (
          <Link
            href="/pricing"
            className="block bg-blue-50 border border-blue-200 rounded-2xl p-5 hover:bg-blue-100 transition-colors"
          >
            <p className="font-semibold text-blue-800">Upgrade to full access</p>
            <p className="text-sm text-blue-600 mt-1">From ₹250 for 30 days · Mock exams · All scopes · Difficulty selection</p>
          </Link>
        )}

        {/* Study stats */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-700 mb-4">Study stats</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: stats.sessions, label: 'Sessions' },
              { value: stats.totalAnswers, label: 'Questions answered' },
              { value: avgScore !== null ? `${avgScore}%` : '—', label: 'Average score' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-slate-800">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <button
            onClick={signOut}
            className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </main>
    </div>
  )
}
