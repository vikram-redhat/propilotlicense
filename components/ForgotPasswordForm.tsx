'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function Logo() {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#185FA5' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <span className="font-bold text-slate-800 text-xl">ProPilotLicence</span>
    </div>
  )
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const resetUrl = `${window.location.origin}/auth/callback?next=/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm">
          <Logo />
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#EBF4FF' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Check your email</h1>
            <p className="text-sm text-slate-500 mb-1">We sent a password reset link to</p>
            <p className="text-sm font-semibold text-slate-800 mb-6">{email}</p>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Click the link to set a new password. Check your spam folder if it doesn&apos;t arrive within a minute.
            </p>
            <Link href="/login" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <Logo />
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h1 className="text-xl font-bold text-slate-900 mb-1 text-center">Reset your password</h1>
          <p className="text-sm text-slate-500 mb-6 text-center">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 mb-6">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              required
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-50"
              style={{ backgroundColor: '#185FA5' }}
            >
              {loading ? 'Sending…' : 'Send reset link →'}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center">
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
