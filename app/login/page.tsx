'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      alert(error.message || 'Failed to send link. Check that your Supabase Site URL is set in Authentication → URL Configuration.')
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm">
          <Logo />
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#EBF4FF' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Check your email</h1>
            <p className="text-sm text-slate-500 mb-1">
              We sent a sign-in link to
            </p>
            <p className="text-sm font-semibold text-slate-800 mb-6">{email}</p>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Click the link in the email to sign in. It may take a minute to arrive — check your spam folder if you don&apos;t see it.
            </p>
            <div className="space-y-2">
              <Link
                href="/verify"
                className="block w-full py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-slate-300 transition-colors"
              >
                Enter a code instead
              </Link>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="block w-full py-2.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                ← Use a different email
              </button>
            </div>
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
          <h1 className="text-xl font-bold text-slate-900 mb-1 text-center">Sign in to your account</h1>
          <p className="text-sm text-slate-500 mb-6 text-center">
            New? Your account is created on first sign in.
          </p>

          <form onSubmit={handleEmail} className="space-y-3 mb-6">
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
              {loading ? 'Sending link…' : 'Continue with email →'}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="text-xs text-slate-400 bg-white px-3">or</span>
            </div>
          </div>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full py-3 rounded-xl border border-slate-200 font-medium text-slate-700 text-sm hover:border-slate-300 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {googleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>
        </div>
      </div>
    </div>
  )
}
