'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Props {
  metId?: string
  navId?: string
  raiId?: string
  regId?: string
  subscribed: boolean
}

export default function CompositeCard({ metId, navId, raiId, regId, subscribed }: Props) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [mode, setMode] = useState<'practice' | 'mock'>('practice')
  const [starting, setStarting] = useState(false)

  async function startComposite() {
    if (!subscribed && mode === 'mock') return
    setStarting(true)
    const res = await fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scope: 'composite',
        licenceType: 'CPL',
        mode,
        difficulty: 'all',
        questionCount: 100,
      }),
    })
    const data = await res.json()
    if (data.sessionId) {
      router.push(`/session/${data.sessionId}`)
    } else {
      alert(data.error || 'Failed to start session')
      setStarting(false)
    }
  }

  const practiceLinks = [
    metId && { href: `/cpl/${metId}`, label: 'Meteorology' },
    navId && { href: `/cpl/${navId}`, label: 'Air Navigation' },
    raiId && { href: `/cpl/${raiId}`, label: 'Radio Aids' },
  ].filter(Boolean) as { href: string; label: string }[]

  return (
    <>
      <div style={{ background: 'var(--clr-surf-alt)', borderRadius: 13, border: '1.5px solid var(--clr-primary)', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--clr-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" fill="#fff" opacity="0.9"/>
              <rect x="10.5" y="1.5" width="6" height="6" rx="1.5" fill="#fff" opacity="0.6"/>
              <rect x="1.5" y="10.5" width="6" height="6" rx="1.5" fill="#fff" opacity="0.6"/>
              <rect x="10.5" y="10.5" width="6" height="6" rx="1.5" fill="#fff" opacity="0.9"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--clr-text)', lineHeight: 1.2 }}>
              Composite Paper
            </div>
            <div style={{ fontSize: 12, color: 'var(--clr-text-med)', marginTop: 3, lineHeight: 1.4 }}>
              Meteorology + Navigation + Air Regulations
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: 'var(--clr-pri-light)', color: 'var(--clr-primary)' }}>
                100 questions
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 20, background: 'var(--clr-surface)', color: 'var(--clr-text-med)', border: '1px solid var(--clr-border)' }}>
                100 min
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            width: '100%', padding: '10px 0', borderRadius: 10,
            background: 'var(--clr-amber)', color: '#fff', border: 'none',
            fontFamily: 'var(--font-outfit),sans-serif', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', letterSpacing: '0.1px',
            boxShadow: '0 3px 12px rgba(239,159,39,0.28)',
          }}
        >
          ⚡ Start Composite paper →
        </button>

        {practiceLinks.length > 0 && (
          <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: 12 }}>
            <p style={{ fontSize: 11, color: 'var(--clr-text-med)', marginBottom: 8 }}>Or practise by subject:</p>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {practiceLinks.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 20,
                    background: 'var(--clr-surface)', color: 'var(--clr-primary)', border: '1px solid var(--clr-border)',
                    textDecoration: 'none',
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick-start modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.38)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => !starting && setShowModal(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: 18, padding: '28px 24px', maxWidth: 360, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 4 }}>
              Composite Paper
            </h3>
            <p style={{ fontSize: 13, color: 'var(--clr-text-med)', marginBottom: 22 }}>
              100 questions · Meteorology + Navigation + Air Regulations
            </p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
              {(['practice', 'mock'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 10,
                    border: `1.5px solid ${mode === m ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                    background: mode === m ? 'var(--clr-pri-light)' : 'var(--clr-surface)',
                    fontFamily: 'var(--font-outfit),sans-serif', fontSize: 13, fontWeight: 600,
                    color: mode === m ? 'var(--clr-primary)' : 'var(--clr-text-med)', cursor: 'pointer',
                  }}
                >
                  {m === 'practice' ? 'Practice' : 'Mock exam · 100 min'}
                </button>
              ))}
            </div>

            {mode === 'mock' && !subscribed && (
              <div style={{ marginBottom: 14, padding: '8px 12px', background: 'var(--clr-amber-light)', border: '1px solid var(--clr-amber)', borderRadius: 8, fontSize: 12, color: '#9A6000' }}>
                Mock exam requires a paid plan.{' '}
                <Link href="/pricing" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Upgrade →</Link>
              </div>
            )}

            <button
              onClick={startComposite}
              disabled={starting || (mode === 'mock' && !subscribed)}
              style={{
                width: '100%', padding: 14, background: 'var(--clr-amber)', color: '#fff', border: 'none',
                borderRadius: 12, fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 700,
                cursor: starting || (mode === 'mock' && !subscribed) ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(239,159,39,0.28)',
                opacity: starting || (mode === 'mock' && !subscribed) ? 0.6 : 1,
              }}
            >
              {starting ? 'Starting…' : 'Start →'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
