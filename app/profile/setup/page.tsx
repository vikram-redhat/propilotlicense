'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type ExamType = 'CPL' | 'Composite' | 'ATPL'

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
  const [selected, setSelected] = useState<ExamType | null>(null)
  const [saving, setSaving] = useState(false)

  async function confirm() {
    if (!selected || saving) return
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      await supabase.from('profiles').update({
        exam_type: selected,
        exam_type_set_at: new Date().toISOString(),
      }).eq('id', user.id)

      // Update user metadata then refresh the session so the proxy
      // sees the new exam_type in the JWT cookie before we redirect
      await supabase.auth.updateUser({ data: { exam_type: selected } })
      await supabase.auth.refreshSession()

      // Full reload — not router.push — so the fresh cookie is sent with the first request
      window.location.href = selected === 'ATPL' ? '/atpl' : '/cpl'
    } catch {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>

        <div style={{ textAlign: 'center', marginBottom: 32, fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: '#0D1B2E', letterSpacing: '-0.3px' }}>
          ProPilot<span style={{ color: '#EF9F27' }}>Licence</span>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #D4E1F0', padding: '36px 28px' }}>
          <div style={{ fontSize: 26, textAlign: 'center', marginBottom: 10 }}>✈</div>
          <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: '#0D1B2E', textAlign: 'center', marginBottom: 4, letterSpacing: '-0.3px' }}>
            One quick question
          </h1>
          <p style={{ fontSize: 21, color: '#4A5E78', textAlign: 'center', marginBottom: 24 }}>
            What are you preparing for?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {OPTIONS.map(opt => {
              const active = selected === opt.type
              return (
                <div
                  key={opt.type}
                  onClick={() => setSelected(opt.type)}
                  style={{
                    border: `1.5px solid ${active ? '#185FA5' : '#D4E1F0'}`,
                    background: active ? '#E8F0FB' : '#F8FAFF',
                    borderRadius: 13, padding: '14px 16px', cursor: 'pointer',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 23, fontWeight: 700, color: active ? '#185FA5' : '#0D1B2E', marginBottom: 2 }}>
                    {opt.title}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 500, color: active ? '#185FA5' : '#0D1B2E', marginBottom: 2 }}>
                    {opt.subtitle}
                  </div>
                  <div style={{ fontSize: 18, color: '#4A5E78' }}>{opt.detail}</div>
                </div>
              )
            })}
          </div>

          <p style={{ fontSize: 18, color: '#4A5E78', textAlign: 'center', marginBottom: 18 }}>
            This personalises your subject list. This choice cannot be changed later.
          </p>

          <button
            onClick={confirm}
            disabled={!selected || saving}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 12,
              background: selected ? '#185FA5' : '#D4E1F0',
              color: '#fff', fontFamily: 'var(--font-outfit),sans-serif',
              fontSize: 23, fontWeight: 700, border: 'none',
              cursor: selected && !saving ? 'pointer' : 'not-allowed',
              opacity: saving ? 0.7 : 1,
              transition: 'background 0.15s',
            }}
          >
            {saving ? 'Setting up…' : 'Confirm →'}
          </button>
        </div>
      </div>
    </div>
  )
}
