'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'
import { useRouter } from 'next/navigation'

// Starts a chapter practice session (same request as the subject picker's book +
// chapter option) and goes straight into it. Chapter practice is a paid scope, so free
// accounts get an upgrade message instead.
export default function StartChapterSession({ subjectId, subjectCode, sourceBookId, chapterId, chapterNumber, licence, chapterLabel, backHref, sourcePage }: {
  subjectId: string
  subjectCode: string | null
  chapterNumber: number
  sourceBookId: string
  chapterId: string
  licence: string
  chapterLabel: string
  backHref: string
  sourcePage: string
}) {
  const router = useRouter()
  const started = useRef(false)
  const [problem, setProblem] = useState<'upgrade' | 'error' | null>(null)

  useEffect(() => {
    if (started.current) return // StrictMode runs effects twice in development
    started.current = true
    fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subjectId, licenceType: licence.toUpperCase(),
        scope: 'book_chapter', sourceBookId, chapterId,
        mode: 'practice', difficulty: 'all', questionCount: 50,
      }),
    })
      .then(async res => {
        const data = await res.json().catch(() => ({}))
        if (res.ok && data.sessionId) {
          // source_page: the chapter page whose CTA leads here (this page only starts the session).
          trackEvent('practice_start', {
            licence, subject: subjectCode ?? undefined, chapter: chapterNumber, mode: 'practice', scope: 'book_chapter',
            source_page: sourcePage,
          })
          router.replace(`/session/${data.sessionId}`)
        }
        else setProblem(String(data.error ?? '').startsWith('free_tier') ? 'upgrade' : 'error')
      })
      .catch(() => setProblem('error'))
  }, [subjectId, subjectCode, sourceBookId, chapterId, chapterNumber, licence, sourcePage, router])

  const box: React.CSSProperties = { maxWidth: 460, margin: '96px auto', padding: '28px 24px', textAlign: 'center', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 14 }
  const primary: React.CSSProperties = { display: 'inline-block', background: 'var(--clr-primary)', color: '#fff', fontWeight: 600, fontSize: 14, padding: '10px 20px', borderRadius: 8, textDecoration: 'none' }
  const secondary: React.CSSProperties = { display: 'inline-block', color: 'var(--clr-primary)', fontWeight: 600, fontSize: 14, padding: '10px 12px', textDecoration: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surf-alt)', padding: '0 16px' }}>
      <div style={box}>
        {!problem && <p style={{ fontSize: 15, color: 'var(--clr-text-med)' }}>Starting {chapterLabel}…</p>}
        {problem === 'upgrade' && (
          <>
            <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 8 }}>Chapter practice is a paid feature</h1>
            <p style={{ fontSize: 14, color: 'var(--clr-text-med)', lineHeight: 1.6, marginBottom: 20 }}>
              Upgrade to practise {chapterLabel} on its own. With a free account you can practise 10 mixed questions from the whole subject.
            </p>
            <Link href="/pricing" style={primary}>See plans</Link>
            <Link href={`/${licence}/${subjectId}`} style={secondary}>Practise free</Link>
          </>
        )}
        {problem === 'error' && (
          <>
            <p style={{ fontSize: 14, color: 'var(--clr-text-med)', lineHeight: 1.6, marginBottom: 20 }}>We couldn&apos;t start {chapterLabel}. Please try again from the subject page.</p>
            <Link href={`/${licence}/${subjectId}`} style={primary}>Go to the subject</Link>
            <Link href={backHref} style={secondary}>Back</Link>
          </>
        )}
      </div>
    </div>
  )
}
