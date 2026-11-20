'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { referrerPath, trackEvent } from '@/lib/analytics'
import { NEW_RULES_BOOK_ID, NEW_RULES_SUBJECT_ID, NEW_RULES_USED_ERROR } from '@/lib/new-rules'
import { FREE_TIER_LINE } from '@/lib/subscription'

// Starts a "New rules 2026" session (lib/new-rules.ts) and goes straight into it: the whole
// set for a paid account; for a free account, its one 10-question session (or that session
// again while it's unfinished), then the upgrade message.
export default function StartNewRulesSession({ licence }: { licence: string }) {
  const router = useRouter()
  const started = useRef(false)
  const [problem, setProblem] = useState<'upgrade' | 'error' | null>(null)
  const [used, setUsed] = useState(false)

  useEffect(() => {
    if (started.current) return // StrictMode runs effects twice in development
    started.current = true
    fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subjectId: NEW_RULES_SUBJECT_ID, licenceType: licence.toUpperCase(),
        scope: 'book', sourceBookId: NEW_RULES_BOOK_ID,
        mode: 'practice', difficulty: 'all', questionCount: 10,
      }),
    })
      .then(async res => {
        const data = await res.json().catch(() => ({}))
        if (res.ok && data.sessionId) {
          if (!data.resumed) {
            trackEvent('practice_start', {
              licence, subject: 'REG', mode: 'practice', scope: 'new_rules',
              source_page: referrerPath(), taster: data.taster === true ? true : undefined,
            })
          }
          router.replace(`/session/${data.sessionId}`)
        } else {
          setUsed(data.error === NEW_RULES_USED_ERROR)
          setProblem(String(data.error ?? '').startsWith('free_tier') ? 'upgrade' : 'error')
        }
      })
      .catch(() => setProblem('error'))
  }, [licence, router])

  const box: React.CSSProperties = { maxWidth: 460, margin: '96px auto', padding: '28px 24px', textAlign: 'center', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 14 }
  const primary: React.CSSProperties = { display: 'inline-block', background: 'var(--clr-primary)', color: '#fff', fontWeight: 600, fontSize: 14, padding: '10px 20px', borderRadius: 8, textDecoration: 'none' }
  const secondary: React.CSSProperties = { display: 'inline-block', color: 'var(--clr-primary)', fontWeight: 600, fontSize: 14, padding: '10px 12px', textDecoration: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surf-alt)', padding: '0 16px' }}>
      <div style={box}>
        {!problem && <p style={{ fontSize: 15, color: 'var(--clr-text-med)' }}>Starting your new-rules practice…</p>}
        {problem === 'upgrade' && (
          <>
            {used && <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--clr-text)', marginBottom: 10 }}>You&apos;ve used your free new-rules session.</p>}
            <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 8 }}>The full new-rules set is a paid feature</h1>
            <p style={{ fontSize: 14, color: 'var(--clr-text-med)', lineHeight: 1.6, marginBottom: 20 }}>
              Upgrade to practise every question on the Bharatiya Vayuyan Niyam. With a free account you get {FREE_TIER_LINE}
            </p>
            <Link href="/pricing" data-cta="new-rules-upgrade" style={primary}>See plans</Link>
            <Link href={`/${licence}/${NEW_RULES_SUBJECT_ID}`} style={secondary}>Practise free</Link>
          </>
        )}
        {problem === 'error' && (
          <>
            <p style={{ fontSize: 14, color: 'var(--clr-text-med)', lineHeight: 1.6, marginBottom: 20 }}>We couldn&apos;t start the new-rules practice. Please try again from Air Regulations.</p>
            <Link href={`/${licence}/${NEW_RULES_SUBJECT_ID}`} style={primary}>Go to Air Regulations</Link>
          </>
        )}
      </div>
    </div>
  )
}
