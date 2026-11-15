'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { endSession } from '@/lib/session-end'
import type { ContinueSession } from '@/lib/continue-session'

// Dashboard card for the student's most recent unfinished session (lib/continue-session.ts).
export default function ContinueSessionCard({ session }: { session: ContinueSession }) {
  const router = useRouter()
  const [ending, setEnding] = useState(false)

  async function endAndSeeResults() {
    setEnding(true)
    await endSession({ sessionId: session.id, endedEarly: true, questions: session.total, mode: session.mode })
    router.push(`/results/${session.id}`)
  }

  return (
    <div style={{ background: 'var(--clr-pri-light)', border: '1.5px solid var(--clr-primary)', borderRadius: 13, padding: 16, marginBottom: 20, maxWidth: 680 }}>
      <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--clr-text)', lineHeight: 1.4 }}>
        Continue: {session.label}
      </div>
      <div style={{ fontSize: 13, color: 'var(--clr-text-med)', marginTop: 2 }}>
        {session.answered} of {session.total} answered
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        <Link
          href={session.continueHref}
          data-cta="continue-session"
          style={{ padding: '9px 18px', borderRadius: 10, background: 'var(--clr-primary)', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
        >
          Continue
        </Link>
        <button
          onClick={endAndSeeResults}
          disabled={ending}
          style={{ padding: '9px 18px', borderRadius: 10, border: '1px solid var(--clr-border)', background: 'var(--clr-surface)', color: 'var(--clr-text)', fontSize: 14, fontWeight: 600, cursor: ending ? 'not-allowed' : 'pointer', opacity: ending ? 0.6 : 1 }}
        >
          {ending ? 'Ending…' : 'End and see results'}
        </button>
      </div>
    </div>
  )
}
