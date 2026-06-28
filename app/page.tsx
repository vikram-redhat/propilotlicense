export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
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
        <rect x="0" y="2" width="3.5" height="4" rx="0.6" fill="var(--clr-amber)"/>
        <rect x="5.5" y="2" width="3.5" height="4" rx="0.6" fill="var(--clr-amber)"/>
        <rect x="11" y="2" width="3.5" height="4" rx="0.6" fill="var(--clr-amber)"/>
        <rect x="16.5" y="2" width="3.5" height="4" rx="0.6" fill="var(--clr-border)"/>
      </svg>
    ),
    title: 'Runway progress bar',
    desc: 'Amber centreline lights fill as you answer — mirrors the real runway.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="14" rx="2" stroke="var(--clr-amber)" strokeWidth="1.4"/>
        <path d="M5 7h8M5 10.5h5" stroke="var(--clr-amber)" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Book-cited explanations',
    desc: 'Every answer cites the exact DGCA source book and chapter.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3.5 13.5l4-4.5 3 3 4-5.5" stroke="var(--clr-amber)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
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
  type SubjectRow = { id: string; name: string; icon_name: string; sort_order: number; licence_types: string[] }

  const [subjectsRes, bookCountRes, profileRes] = await Promise.all([
    svc.from('subjects').select('id, name, icon_name, sort_order, licence_types').eq('active', true).order('sort_order'),
    svc.from('source_books').select('*', { count: 'exact', head: true }),
    user ? svc.from('profiles').select('subscription_tier, subscription_expires_at').eq('id', user.id).single() : Promise.resolve({ data: null }),
  ])

  const subjectRows = (subjectsRes.data as SubjectRow[] || [])

  // Count per subject using individual count queries (avoids the 1000-row default limit on bulk selects)
  const countResults = await Promise.all(
    subjectRows.map(s =>
      svc.from('questions').select('*', { count: 'exact', head: true }).eq('active', true).eq('subject_id', s.id)
    )
  )

  const subjects = subjectRows.map((s, i) => ({
    ...s,
    questionCount: countResults[i].count ?? 0,
    href: (s.licence_types?.includes('CPL') ? '/cpl/' : '/atpl/') + s.id,
  }))

  const totalQuestions = subjects.reduce((a, s) => a + s.questionCount, 0)
  const bookCount = bookCountRes.count ?? 0
  const subscribed = isSubscribed(profileRes?.data as Parameters<typeof isSubscribed>[0])
  const examType = user?.user_metadata?.exam_type ?? null

  const configHref = user ? '/cpl' : '/login?next=/cpl'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <LandingHeader isLoggedIn={!!user} name={name} subscribed={subscribed} examType={examType} />

      {/* ── Full-bleed hero ── */}
      <style>{`.hero-section { background:var(--clr-hero) } @media(min-width:1024px){.hero-section{height:500px;overflow:hidden}}`}</style>
      <section className="hero-section flex flex-col lg:flex-row">
        {/* Left: text panel */}
        <style>{`
          .hero-text-panel { padding: 40px 20px 44px; }
          @media (min-width: 640px)  { .hero-text-panel { padding: 48px 36px; } }
          @media (min-width: 1024px) { .hero-text-panel { padding: 48px 60px; overflow: hidden; } }
        `}</style>
        <div className="hero-text-panel flex flex-col justify-center lg:w-[52%]">

            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.09)', borderRadius: 20, padding: '4px 12px', marginBottom: 20, width: 'fit-content' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--clr-amber)', flexShrink: 0, display: 'block' }}/>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.78)', letterSpacing: '0.9px', textTransform: 'uppercase' }}>DGCA Exam Prep</span>
            </div>

            {/* Headline */}
            <h1
              className="text-[30px] sm:text-[38px] lg:text-[50px]"
              style={{ fontFamily: 'var(--font-outfit),sans-serif', fontWeight: 700, color: '#ffffff', marginBottom: 14, lineHeight: 1.1, letterSpacing: '-0.6px' }}
            >
              Pass your pilot exams.<br/>
              <em style={{ fontStyle: 'normal', color: 'var(--clr-amber)' }}>First attempt.</em>
            </h1>

            <p style={{ fontSize: 17, lineHeight: 1.65, color: 'rgba(255,255,255,0.72)', marginBottom: 28, maxWidth: 460 }}>
              India&apos;s most complete CPL / ATPL question bank — mapped to DGCA syllabus and source books.
            </p>

            {/* CTA */}
            <Link
              href={configHref}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--clr-amber)', color: '#fff', border: 'none', borderRadius: 11, padding: '14px 26px', fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.1px', boxShadow: '0 4px 24px var(--clr-amber-glow)', marginBottom: 40, width: 'fit-content' }}
            >
              Get Started
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M8.5 3.5L12 7l-3.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
                  {totalQuestions > 0 ? `${(totalQuestions / 1000).toFixed(1).replace(/\.0$/, '')}k+` : '4,100+'}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>questions</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>{subjects.length || 5}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>subjects</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>{bookCount || 46}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>source books</div>
              </div>
            </div>
        </div>

        {/* Right: photo mosaic — hidden on mobile, strip on tablet, 2×2 grid on desktop */}
        <style>{`
          .hero-mosaic {
            display: none;
          }
          @media (min-width: 640px) {
            .hero-mosaic {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              grid-template-rows: 260px;
              gap: 3px;
              overflow: hidden;
            }
          }
          @media (min-width: 1024px) {
            .hero-mosaic {
              flex: 0 0 48%;
              grid-template-columns: 1fr 1fr;
              grid-template-rows: 1fr 1fr;
              height: 100%;
            }
            .hero-mosaic-main { grid-row: 1 / 3; }
          }
        `}</style>
        <div className="hero-mosaic">
          <Image
            src="/hero/img-2.png"
            alt=""
            width={600}
            height={800}
            className="hero-mosaic-main"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
            priority
          />
          <Image
            src="/hero/172100.jpg"
            alt=""
            width={400}
            height={400}
            priority
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }}
          />
          <Image
            src="/hero/epaulettes.png"
            alt=""
            width={400}
            height={400}
            priority
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          />
        </div>
      </section>

      {/* ── Content section (full-bleed, padding-based) ── */}
      <div className="px-5 sm:px-9 lg:px-[60px] pt-7 sm:pt-8 lg:pt-[44px] pb-[88px] sm:pb-20 lg:pb-[88px]">

        {/* Subjects grid */}
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: 'var(--clr-text-med)', marginBottom: 10 }}>Subjects covered</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
          {subjects.map((s, i) => (
            <Link
              key={s.id}
              href={s.href}
              className={`hover:border-[var(--clr-primary)] ${i === subjects.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}
              style={{ background: 'var(--clr-surf-alt)', border: '1px solid var(--clr-border)', borderRadius: 13, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, textDecoration: 'none', transition: 'border-color 0.2s' }}
            >
              <SubjectIcon name={s.icon_name} size={22} className="text-[var(--clr-primary)]" />
              <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--clr-text)' }}>{s.name}</div>
              <div style={{ fontSize: 13, color: 'var(--clr-text-med)' }}>{s.questionCount > 0 ? `${s.questionCount.toLocaleString()} questions` : 'Coming soon'}</div>
            </Link>
          ))}
        </div>

        {/* Features row */}
        <div style={{ background: 'var(--clr-surf-alt)', border: '1px solid var(--clr-border)', borderRadius: 16, padding: '20px 18px', marginBottom: 16 }} className="flex flex-col sm:flex-row gap-4">
          {FEATURES.map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--clr-amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--clr-text)', marginBottom: 3 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--clr-text-med)', lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <Link
          href={configHref}
          style={{ display: 'block', width: '100%', padding: 15, background: 'var(--clr-hero)', color: '#fff', border: 'none', borderRadius: 13, fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 600, textDecoration: 'none', textAlign: 'center', letterSpacing: '0.1px' }}
        >
          Get Started →
        </Link>
      </div>

      <SiteFooter />
    </div>
  )
}
