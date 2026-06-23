'use client'
import { useState, useEffect, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function VerifyPage() {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [countdown, setCountdown] = useState(30)
  const [resending, setResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const stored = sessionStorage.getItem('otp_email')
    if (!stored) { router.push('/login'); return }
    setEmail(stored)
    inputRefs.current[0]?.focus()
  }, [router])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(n => n - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  async function verify(code: string) {
    if (code.length !== 6) return
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }
    sessionStorage.removeItem('otp_email')
    router.push('/')
    router.refresh()
  }

  function handleDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    setDigits(next)
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    if (index === 5 && digit) {
      verify(next.join(''))
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'Enter') {
      verify(digits.join(''))
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    e.preventDefault()
    const next = [...text.split(''), ...Array(6).fill('')].slice(0, 6) as string[]
    setDigits(next)
    inputRefs.current[Math.min(text.length, 5)]?.focus()
    if (text.length === 6) verify(text)
  }

  async function resend() {
    setResending(true)
    await supabase.auth.signInWithOtp({ email })
    setCountdown(30)
    setResending(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#185FA5' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-xl">ProPilotLicence</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h1 className="text-xl font-bold text-slate-900 mb-1 text-center">Check your email</h1>
          <p className="text-sm text-slate-500 mb-6 text-center">
            We sent a 6-digit code to{' '}
            <span className="font-medium text-slate-700">{email}</span>
          </p>

          <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-11 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 text-slate-800 transition-colors"
              />
            ))}
          </div>

          <button
            onClick={() => verify(digits.join(''))}
            disabled={loading || digits.join('').length !== 6}
            className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-50 mb-4"
            style={{ backgroundColor: '#185FA5' }}
          >
            {loading ? 'Verifying…' : 'Verify code'}
          </button>

          <p className="text-center text-sm text-slate-500 mb-3">
            Didn&apos;t receive it?{' '}
            <button
              onClick={resend}
              disabled={countdown > 0 || resending}
              className="text-blue-600 hover:underline disabled:text-slate-400 disabled:no-underline"
            >
              {countdown > 0 ? `Resend in ${countdown}s` : resending ? 'Sending…' : 'Resend'}
            </button>
          </p>

          <div className="text-center">
            <Link href="/login" className="text-sm text-slate-400 hover:text-slate-600">
              ← Use a different email
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
