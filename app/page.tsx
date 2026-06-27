import Link from 'next/link'
import { redirect } from 'next/navigation'
import LandingHeader from '@/components/LandingHeader'
import SiteFooter from '@/components/SiteFooter'
import SubjectIcon from '@/components/SubjectIcon'
import { createAuthClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase'
import { isSubscribed } from '@/lib/subscription'

const FEATURES = [
  {
    icon: (
      <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
        <rect x="0" y="2" width="3.5" height="4" rx="0.6" fill="#EF9F27"/>
        <rect x="5.5" y="2" width="3.5" height="4" rx="0.6" fill="#EF9F27"/>
        <rect x="11" y="2" width="3.5" height="4" rx="0.6" fill="#EF9F27"/>
        <rect x="16.5" y="2" width="3.5" height="4" rx="0.6" fill="#D4E1F0"/>
      </svg>
    ),
    title: 'Runway progress bar',
    desc: 'Amber centreline lights fill as you answer — mirrors the real runway.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="14" rx="2" stroke="#EF9F27" strokeWidth="1.4"/>
        <path d="M5 7h8M5 10.5h5" stroke="#EF9F27" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Book-cited explanations',
    desc: 'Every answer cites the exact DGCA source book and chapter.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3.5 13.5l4-4.5 3 3 4-5.5" stroke="#EF9F27" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Adaptive difficulty',
    desc: 'Sessions adapt to your revision stage — start easy, ramp up.',
  },
]

export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  if (params.code) {
    const qs = new URLSearchParams({ code: params.code })
    if (params.type) qs.set('type', params.type)
    redirect(`/auth/callback?${qs.toString()}`)
  }

  const supabase = await createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()
  const name = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? null

  const svc = createServiceClient()
  const [subjectsRes, qCountRes, bookCountRes, profileRes] = await Promise.all([
    svc.from('subjects').select('id, name, icon_name, sort_order, licence_types').eq('active', true).order('sort_order'),
    svc.from('questions').select('subject_id').eq('active', true),
    svc.from('source_books').select('*', { count: 'exact', head: true }),
    user ? svc.from('profiles').select('subscription_tier, subscription_expires_at').eq('id', user.id).single() : Promise.resolve({ data: null }),
  ])

  const qMap: Record<string, number> = {}
  qCountRes.data?.forEach((q: { subject_id: string }) => { qMap[q.subject_id] = (qMap[q.subject_id] || 0) + 1 })

  type SubjectRow = { id: string; name: string; icon_name: string; sort_order: number; licence_types: string[] }
  const subjects = (subjectsRes.data as SubjectRow[] || []).map(s => ({
    ...s,
    questionCount: qMap[s.id] || 0,
    href: (s.licence_types?.includes('CPL') ? '/cpl/' : '/atpl/') + s.id,
  }))

  const totalQuestions = Object.values(qMap).reduce((a, b) => a + b, 0)
  const bookCount = bookCountRes.count ?? 0
  const subscribed = isSubscribed(profileRes?.data as Parameters<typeof isSubscribed>[0])

  const configHref = user ? '/cpl' : '/login?next=/cpl'

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', color: '#0D1B2E' }}>
      <LandingHeader isLoggedIn={!!user} name={name} subscribed={subscribed} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px 88px' }}>

        {/* ── Hero card ── */}
        <div style={{ background: '#042C53', borderRadius: 22, padding: '28px 24px 24px', position: 'relative', overflow: 'hidden', marginBottom: 16 }}>
          {/* Concentric circles decoration */}
          <svg style={{ position: 'absolute', right: -55, top: -55, pointerEvents: 'none' }} width="340" height="340" viewBox="0 0 340 340" overflow="visible" aria-hidden="true">
            <g fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5">
              <circle cx="340" cy="0" r="70"/><circle cx="340" cy="0" r="115"/>
              <circle cx="340" cy="0" r="160"/><circle cx="340" cy="0" r="205"/><circle cx="340" cy="0" r="250"/>
            </g>
          </svg>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.09)', borderRadius: 20, padding: '4px 12px', marginBottom: 16 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF9F27', flexShrink: 0, display: 'block' }}/>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.78)', letterSpacing: '0.9px', textTransform: 'uppercase' }}>DGCA Exam Prep</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontWeight: 700, color: '#ffffff', marginBottom: 10 }} className="text-[30px] sm:text-[38px] lg:text-[50px] leading-tight tracking-tight">
            Pass your pilot exams.<br/>
            <em style={{ fontStyle: 'normal', color: '#EF9F27' }}>First attempt.</em>
          </h1>

          <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.58)', marginBottom: 24, maxWidth: 520 }}>
            India&apos;s most complete CPL / ATPL question bank — mapped to DGCA syllabus and source books.
          </p>

          <Link
            href={configHref}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EF9F27', color: '#fff', border: 'none', borderRadius: 11, padding: '13px 22px', fontFamily: 'var(--font-outfit),sans-serif', fontSize: 14, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.1px', boxShadow: '0 4px 20px rgba(239,159,39,0.32)' }}
          >
            {user ? 'Continue practising' : 'Start practising free'}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M8.5 3.5L12 7l-3.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.11)' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
                {totalQuestions > 0 ? `${(totalQuestions / 1000).toFixed(1).replace(/\.0$/, '')}k+` : '—'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.48)', marginTop: 2 }}>questions</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>{subjects.length}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.48)', marginTop: 2 }}>subjects</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>{bookCount}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.48)', marginTop: 2 }}>source books</div>
            </div>
          </div>
        </div>

        {/* ── Subjects grid ── */}
        <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: '#4A5E78', marginBottom: 10 }}>Subjects covered</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
          {subjects.map(s => (
            <Link
              key={s.id}
              href={s.href}
              style={{ background: '#EEF3FA', border: '1px solid #D4E1F0', borderRadius: 13, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, textDecoration: 'none', transition: 'border-color 0.2s' }}
              className="hover:border-[#185FA5]"
            >
              <SubjectIcon name={s.icon_name} size={22} className="text-[#185FA5]" />
              <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 13, fontWeight: 600, color: '#0D1B2E' }}>{s.name}</div>
              <div style={{ fontSize: 11, color: '#4A5E78' }}>{s.questionCount > 0 ? `${s.questionCount.toLocaleString()} questions` : 'Coming soon'}</div>
            </Link>
          ))}
        </div>

        {/* ── Features ── */}
        <div style={{ background: '#EEF3FA', border: '1px solid #D4E1F0', borderRadius: 16, padding: '20px 18px', marginBottom: 16 }} className="flex flex-col sm:flex-row gap-4">
          {FEATURES.map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: '#FEF4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 13, fontWeight: 600, color: '#0D1B2E', marginBottom: 3 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: '#4A5E78', lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <Link
          href={configHref}
          style={{ display: 'block', width: '100%', padding: 15, background: '#042C53', color: '#fff', border: 'none', borderRadius: 13, fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 600, textDecoration: 'none', textAlign: 'center', letterSpacing: '0.1px' }}
        >
          Configure a session →
        </Link>
      </div>

      <SiteFooter />
    </div>
  )
}
