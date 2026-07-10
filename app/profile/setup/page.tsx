'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { flagEmoji } from '@/lib/countries'
import type { Country } from '@/lib/types'

type ExamType = 'CPL' | 'Composite' | 'ATPL'
type Step = 'name' | 'examType' | 'country'

const OPTIONS: { type: ExamType; title: string; subtitle: string; detail: string }[] = [
  {
    type: 'CPL',
    title: 'CPL',
    subtitle: 'Commercial Pilot Licence',
    detail: 'Training in India',
  },
  {
    type: 'Composite',
    title: 'Composite',
    subtitle: 'Foreign licence conversion',
    detail: 'Converting FAA / EASA / other CPL to Indian DGCA licence',
  },
  {
    type: 'ATPL',
    title: 'ATPL',
    subtitle: 'Airline Transport Pilot Licence',
    detail: 'Upgrading from CPL',
  },
]

export default function ProfileSetupPage() {
  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [examType, setExamType] = useState<ExamType | null>(null)
  const [country, setCountry] = useState<string | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [countriesLoaded, setCountriesLoaded] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('countries').select('*').eq('active', true).order('sort_order').then(({ data }) => {
      setCountries(data || [])
      setCountriesLoaded(true)
    })
  }, [])

  function goToCountryStep() {
    if (!examType) return
    // Only skip the country step once we've confirmed the catalog is genuinely empty —
    // a fast click before the fetch resolves should never silently default someone to India.
    if (countriesLoaded && countries.length === 0) {
      finish(examType, 'IN')
      return
    }
    setStep('country')
  }

  async function finish(finalExamType: ExamType, finalCountry: string) {
    if (saving) return
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const finalName = name.trim()
      await supabase.from('profiles').update({
        full_name: finalName,
        exam_type: finalExamType,
        exam_type_set_at: new Date().toISOString(),
        country: finalCountry,
        country_set_at: new Date().toISOString(),
      }).eq('id', user.id)

      // Update user metadata then refresh the session so the proxy sees the new
      // exam_type/country in the JWT cookie (and the header sees full_name) before we redirect
      await supabase.auth.updateUser({ data: { full_name: finalName, exam_type: finalExamType, country: finalCountry } })
      await supabase.auth.refreshSession()

      // Full reload — not router.push — so the fresh cookie is sent with the first request
      window.location.href = finalExamType === 'ATPL' ? '/atpl' : '/cpl'
    } catch {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>

        <div style={{ textAlign: 'center', marginBottom: 32, fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.3px' }}>
          ProPilot<span style={{ color: 'var(--clr-amber)' }}>Licence</span>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--clr-border)', padding: '36px 28px' }}>
          {step === 'name' ? (
            <>
              <div style={{ fontSize: 26, textAlign: 'center', marginBottom: 10 }}>👋</div>
              <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--clr-text)', textAlign: 'center', marginBottom: 4, letterSpacing: '-0.3px' }}>
                Welcome aboard
              </h1>
              <p style={{ fontSize: 14, color: 'var(--clr-text-med)', textAlign: 'center', marginBottom: 24 }}>
                What should we call you?
              </p>

              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && name.trim()) setStep('examType') }}
                placeholder="Full name"
                autoFocus
                autoComplete="name"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 12,
                  border: '1.5px solid var(--clr-border)', background: 'var(--clr-surface)',
                  color: 'var(--clr-text)', fontSize: 15, marginBottom: 20, outline: 'none',
                }}
              />

              <button
                onClick={() => name.trim() && setStep('examType')}
                disabled={!name.trim()}
                style={{
                  width: '100%', padding: '14px 0', borderRadius: 12,
                  background: name.trim() ? 'var(--clr-primary)' : 'var(--clr-border)',
                  color: '#fff', fontFamily: 'var(--font-outfit),sans-serif',
                  fontSize: 15, fontWeight: 700, border: 'none',
                  cursor: name.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background 0.15s',
                }}
              >
                Continue →
              </button>
            </>
          ) : step === 'examType' ? (
            <>
              <div style={{ fontSize: 26, textAlign: 'center', marginBottom: 10 }}>✈</div>
              <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--clr-text)', textAlign: 'center', marginBottom: 4, letterSpacing: '-0.3px' }}>
                One quick question
              </h1>
              <p style={{ fontSize: 14, color: 'var(--clr-text-med)', textAlign: 'center', marginBottom: 24 }}>
                What are you preparing for?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {OPTIONS.map(opt => {
                  const active = examType === opt.type
                  return (
                    <div
                      key={opt.type}
                      onClick={() => setExamType(opt.type)}
                      style={{
                        border: `1.5px solid ${active ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                        background: active ? 'var(--clr-pri-light)' : 'var(--clr-surface)',
                        borderRadius: 13, padding: '14px 16px', cursor: 'pointer',
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 700, color: active ? 'var(--clr-primary)' : 'var(--clr-text)', marginBottom: 2 }}>
                        {opt.title}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: active ? 'var(--clr-primary)' : 'var(--clr-text)', marginBottom: 2 }}>
                        {opt.subtitle}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--clr-text-med)' }}>{opt.detail}</div>
                    </div>
                  )
                })}
              </div>

              <p style={{ fontSize: 12, color: 'var(--clr-text-med)', textAlign: 'center', marginBottom: 18 }}>
                This personalises your subject list. This choice cannot be changed later.
              </p>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setStep('name')}
                  disabled={saving}
                  style={{
                    padding: '14px 18px', borderRadius: 12,
                    background: 'var(--clr-surface)', border: '1.5px solid var(--clr-border)',
                    color: 'var(--clr-text-med)', fontFamily: 'var(--font-outfit),sans-serif',
                    fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={goToCountryStep}
                  disabled={!examType || saving}
                  style={{
                    flex: 1, padding: '14px 0', borderRadius: 12,
                    background: examType ? 'var(--clr-primary)' : 'var(--clr-border)',
                    color: '#fff', fontFamily: 'var(--font-outfit),sans-serif',
                    fontSize: 15, fontWeight: 700, border: 'none',
                    cursor: examType && !saving ? 'pointer' : 'not-allowed',
                    opacity: saving ? 0.7 : 1,
                    transition: 'background 0.15s',
                  }}
                >
                  {saving ? 'Setting up…' : 'Continue →'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 26, textAlign: 'center', marginBottom: 10 }}>🌍</div>
              <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--clr-text)', textAlign: 'center', marginBottom: 4, letterSpacing: '-0.3px' }}>
                One more thing
              </h1>
              <p style={{ fontSize: 14, color: 'var(--clr-text-med)', textAlign: 'center', marginBottom: 24 }}>
                Which country&apos;s exam are you studying for?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {countries.map(c => {
                  const active = country === c.code
                  return (
                    <div
                      key={c.code}
                      onClick={() => setCountry(c.code)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        border: `1.5px solid ${active ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                        background: active ? 'var(--clr-pri-light)' : 'var(--clr-surface)',
                        borderRadius: 13, padding: '14px 16px', cursor: 'pointer',
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                    >
                      <span style={{ fontSize: 22, lineHeight: 1 }}>{flagEmoji(c.code)}</span>
                      <span style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 700, color: active ? 'var(--clr-primary)' : 'var(--clr-text)' }}>
                        {c.name}
                      </span>
                    </div>
                  )
                })}
              </div>

              <p style={{ fontSize: 12, color: 'var(--clr-text-med)', textAlign: 'center', marginBottom: 18 }}>
                This determines which reference books and content you&apos;ll see. This choice cannot be changed later.
              </p>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setStep('examType')}
                  disabled={saving}
                  style={{
                    padding: '14px 18px', borderRadius: 12,
                    background: 'var(--clr-surface)', border: '1.5px solid var(--clr-border)',
                    color: 'var(--clr-text-med)', fontFamily: 'var(--font-outfit),sans-serif',
                    fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={() => examType && country && finish(examType, country)}
                  disabled={!country || saving}
                  style={{
                    flex: 1, padding: '14px 0', borderRadius: 12,
                    background: country ? 'var(--clr-primary)' : 'var(--clr-border)',
                    color: '#fff', fontFamily: 'var(--font-outfit),sans-serif',
                    fontSize: 15, fontWeight: 700, border: 'none',
                    cursor: country && !saving ? 'pointer' : 'not-allowed',
                    opacity: saving ? 0.7 : 1,
                    transition: 'background 0.15s',
                  }}
                >
                  {saving ? 'Setting up…' : 'Confirm →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
