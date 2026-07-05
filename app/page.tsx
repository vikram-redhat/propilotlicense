export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ProPilotLicence — DGCA CPL & ATPL Theory Exam Prep',
  description: 'India\'s most complete DGCA CPL and ATPL question bank — 7,000+ questions mapped to prescribed textbooks, verified by active airline captains. First 10 questions free.',
  alternates: { canonical: 'https://propilotlicence.com' },
  openGraph: {
    title: 'ProPilotLicence — DGCA CPL & ATPL Theory Exam Prep',
    description: 'India\'s most complete DGCA CPL and ATPL question bank — 7,000+ questions mapped to prescribed textbooks, verified by active airline captains.',
    url: 'https://propilotlicence.com',
    siteName: 'ProPilotLicence',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ProPilotLicence — DGCA CPL & ATPL Theory Exam Prep' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.jpg'] },
}
import Image from 'next/image'
import { redirect } from 'next/navigation'
import LandingHeader from '@/components/LandingHeader'
import SiteFooter from '@/components/SiteFooter'
import SubjectIcon from '@/components/SubjectIcon'
import { createAuthClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase'
import { isSubscribed } from '@/lib/subscription'

const MONO = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"

// Raw topic names come from the ATA-chapter question bank as entered by the captain
// panel (inconsistent casing/spacing) — mapped here to clean display labels.
const AIRBUS_TOPIC_LABELS: Record<string, { ata: string; label: string }> = {
  'ATA21 AIRCONDITIONING': { ata: 'ATA 21', label: 'Air Conditioning' },
  'ATA21 20 PRESSURISATION': { ata: 'ATA 21', label: 'Pressurisation' },
  'ATA21 30 VENTILATION': { ata: 'ATA 21', label: 'Ventilation' },
  'ATA21 40 CARGO': { ata: 'ATA 21', label: 'Cargo' },
  'ATA 22_10 AUTO FLIGHT -  GENERAL': { ata: 'ATA 22', label: 'Autoflight — General' },
  'ATA22_20 AUTO FLIGHT - FLIGHT MANAGEMENT': { ata: 'ATA 22', label: 'Autoflight — Flight Management' },
  'ATA22_30 AUTOFLIGHT - FLIGHT GUIDANCE': { ata: 'ATA 22', label: 'Autoflight — Flight Guidance' },
  'ATA22_41 AUTO FLIGHT - Flight Envelope': { ata: 'ATA 22', label: 'Autoflight — Flight Envelope' },
  'ATA22_40 AUTOFLIGHT - FLIGHT AUGMENTATION': { ata: 'ATA 22', label: 'Autoflight — Flight Augmentation' },
  'AT23 COMMUNICATIONS': { ata: 'ATA 23', label: 'Communications' },
  'ATA24 ELECTRICAL': { ata: 'ATA 24', label: 'Electrical' },
  'ATA25 EQUIPMENT': { ata: 'ATA 25', label: 'Equipment & Furnishings' },
  'ATA26 FIRE PROTECTION': { ata: 'ATA 26', label: 'Fire Protection' },
  'ATA27 FLIGHT CONTROLS': { ata: 'ATA 27', label: 'Flight Controls' },
  'ATA28 FUEL': { ata: 'ATA 28', label: 'Fuel' },
  'ATA29 HYDRAULIC': { ata: 'ATA 29', label: 'Hydraulics' },
  'ATA30 ICE AND RAIN PROTECTION': { ata: 'ATA 30', label: 'Ice & Rain Protection' },
  'ATA31 INDICATING AND RECORDING SYSTEMS': { ata: 'ATA 31', label: 'Indicating & Recording Systems' },
  'ATA32 LANDING GEAR': { ata: 'ATA 32', label: 'Landing Gear' },
  'ATA33 LIGHTS': { ata: 'ATA 33', label: 'Lights' },
  'ATA34 NAV NAVIGATION': { ata: 'ATA 34', label: 'Navigation' },
  'ATA34 SURV SURVEILLANCE': { ata: 'ATA 34', label: 'Surveillance' },
  'ATA35 OXYGEN': { ata: 'ATA 35', label: 'Oxygen' },
  'ATA36 PNEUMATIC': { ata: 'ATA 36', label: 'Pneumatic' },
  'ATA38 WATER / WASTE': { ata: 'ATA 38', label: 'Water / Waste' },
  'ATA45 MAINTENANCE SYSTEM': { ata: 'ATA 45', label: 'Central Maintenance System' },
  'ATA46 INFORMATION SYSTEM': { ata: 'ATA 46', label: 'Information System' },
  'ATA49 APU': { ata: 'ATA 49', label: 'APU' },
  'ATA52 DOORS': { ata: 'ATA 52', label: 'Doors' },
  'ATA53 STRUCTURE': { ata: 'ATA 53', label: 'Structure' },
  'ATA56 COCKPIT WINDOWS': { ata: 'ATA 56', label: 'Cockpit Windows' },
  'ATA70 ENGINES': { ata: 'ATA 70', label: 'Engines' },
  'SAFETY FIRST': { ata: '', label: 'Safety First' },
}

function formatAtaTopic(raw: string): { ata: string; label: string } {
  if (AIRBUS_TOPIC_LABELS[raw]) return AIRBUS_TOPIC_LABELS[raw]
  const match = raw.match(/^ATA\s?(\d+)(?:[_\s]+\d+)?\s*[-–]?\s*/i)
  const ata = match ? `ATA ${match[1]}` : ''
  const rest = (match ? raw.slice(match[0].length) : raw).trim()
  const label = rest
    .split(/\s+/)
    .map(w => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(' ')
  return { ata, label: label || raw }
}

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
  type SubjectRow = { id: string; name: string; code: string; icon_name: string; sort_order: number; licence_types: string[] }

  const CODE_TO_SLUG: Record<string, string> = {
    MET:                  'aviation-meteorology',
    REG:                  'air-regulations',
    NAV:                  'air-navigation',
    TECH:                 'technical-general',
    RADIOAIDSINSTRUMENTS: 'radio-aids-instruments',
  }
  const NAME_TO_SLUG: Record<string, string> = {
    'meteorology':               'aviation-meteorology',
    'aviation meteorology':      'aviation-meteorology',
    'air regulations':           'air-regulations',
    'air navigation':            'air-navigation',
    'technical general':         'technical-general',
    'radio aids & instruments':  'radio-aids-instruments',
    'radio aids and instruments':'radio-aids-instruments',
  }

  const [subjectsRes, bookCountRes, profileRes] = await Promise.all([
    svc.from('subjects').select('id, name, code, icon_name, sort_order, licence_types').eq('active', true).order('sort_order'),
    svc.from('source_books').select('*', { count: 'exact', head: true }),
    user ? svc.from('profiles').select('subscription_tier, subscription_expires_at').eq('id', user.id).single() : Promise.resolve({ data: null }),
  ])

  const subjectRows = (subjectsRes.data as SubjectRow[] || [])
  const airbusRow = subjectRows.find(s => s.code === 'A320FAMILY')

  // Count per subject using individual count queries (avoids the 1000-row default limit on bulk selects)
  const [countResults, airbusTopicsRes] = await Promise.all([
    Promise.all(
      subjectRows.map(s =>
        svc.from('questions').select('*', { count: 'exact', head: true }).eq('active', true).eq('subject_id', s.id)
      )
    ),
    airbusRow
      ? svc.from('topics').select('name').eq('subject_id', airbusRow.id).order('sort_order')
      : Promise.resolve({ data: [] as { name: string }[] }),
  ])

  const subjects = subjectRows.map((s, i) => {
    const slug = (s.code && CODE_TO_SLUG[s.code]) || NAME_TO_SLUG[s.name.toLowerCase()]
    return {
      ...s,
      questionCount: countResults[i].count ?? 0,
      href: (s.licence_types?.includes('CPL') ? '/cpl/' : '/atpl/') + s.id,
      publicHref: slug ? `/subjects/${slug}` : '/subjects',
    }
  })

  const regularSubjects = subjects.filter(s => s.code !== 'A320FAMILY')
  const airbusSubject = subjects.find(s => s.code === 'A320FAMILY')
  const airbusTopics = ((airbusTopicsRes.data as { name: string }[]) || []).map(t => formatAtaTopic(t.name))

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

        {/* Right: two-image panel — hidden on mobile, side-by-side on sm+, 48% wide on desktop */}
        <style>{`
          .hero-mosaic {
            display: none;
          }
          @media (min-width: 640px) {
            .hero-mosaic {
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-template-rows: 260px;
              gap: 3px;
              overflow: hidden;
            }
          }
          @media (min-width: 1024px) {
            .hero-mosaic {
              flex: 0 0 48%;
              grid-template-columns: 1fr 1fr;
              grid-template-rows: 1fr;
              height: 100%;
            }
          }
        `}</style>
        <div className="hero-mosaic">
          <Image
            src="/hero/img-2.png"
            alt=""
            width={600}
            height={800}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 72%', display: 'block' }}
            priority
          />
          <Image
            src="/hero/epaulettes.jpg"
            alt=""
            width={900}
            height={1200}
            priority
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', display: 'block' }}
          />
        </div>
      </section>

      {/* ── Content section (full-bleed, padding-based) ── */}
      <div className="px-5 sm:px-9 lg:px-[60px] pt-7 sm:pt-8 lg:pt-[44px] pb-[88px] sm:pb-20 lg:pb-[88px]">

        {/* Subjects grid */}
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: 'var(--clr-text-med)', marginBottom: 10 }}>Subjects covered</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
          {regularSubjects.map((s) => (
            <Link
              key={s.id}
              href={user ? s.href : s.publicHref}
              className="hover:border-[var(--clr-primary)]"
              style={{ background: 'var(--clr-surf-alt)', border: '1px solid var(--clr-border)', borderRadius: 13, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, textDecoration: 'none', transition: 'border-color 0.2s' }}
            >
              <SubjectIcon name={s.icon_name} size={22} className="text-[var(--clr-primary)]" />
              <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--clr-text)' }}>{s.name}</div>
              <div style={{ fontSize: 13, color: 'var(--clr-text-med)' }}>{s.questionCount > 0 ? `${s.questionCount.toLocaleString()} questions` : 'Coming soon'}</div>
            </Link>
          ))}
        </div>

        {/* Airbus A320 family — shown separately with full topic breakdown */}
        {airbusSubject && (
          <div style={{ border: '1px solid var(--clr-border)', borderRadius: 16, padding: '18px 20px', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 14, background: 'linear-gradient(135deg, var(--clr-pri-light) 0%, var(--clr-surf-alt) 60%)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <SubjectIcon name={airbusSubject.icon_name} size={22} className="text-[var(--clr-primary)]" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--clr-text)' }}>Airbus A320 Family</div>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--clr-amber-light)', color: 'var(--clr-amber)', padding: '3px 8px', borderRadius: 5 }}>New</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--clr-text-med)', marginTop: 2 }}>320 / 319 / 321 · XLR · NEO · CEO · PW · IAE · CFM · LEAP</div>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-primary)', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 8, padding: '6px 12px', whiteSpace: 'nowrap' }}>
                {airbusSubject.questionCount > 0 ? `${airbusSubject.questionCount.toLocaleString()} questions` : 'Coming soon'}
              </div>
            </div>

            {airbusTopics.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--clr-text-med)', marginBottom: 8 }}>
                  Every ATA chapter covered
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {airbusTopics.map((t, i) => (
                    <span
                      key={i}
                      style={{ fontSize: 12, color: 'var(--clr-text)', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 20, padding: '5px 11px', display: 'inline-flex', alignItems: 'center', gap: 6, lineHeight: 1.3 }}
                    >
                      {t.ata && <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: 'var(--clr-primary)' }}>{t.ata}</span>}
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link href={user ? airbusSubject.href : airbusSubject.publicHref} style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>
              Practise Airbus A320 questions →
            </Link>
          </div>
        )}

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

        {/* Captain verification section */}
        <div style={{ border: '1px solid var(--clr-border)', borderRadius: 16, padding: '20px 20px', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--clr-pri-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--clr-text)' }}>Every question verified by working captains</div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--clr-text-med)', lineHeight: 1.65, margin: 0 }}>
            Before any question enters the bank, it is reviewed by a panel of four or more active commercial airline captains — currently flying on Indian routes, holding valid DGCA CPL and ATPL licences. They check for technical accuracy, correct answer, distractor quality, and regulatory currency.
          </p>
          <Link href="/about" style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>
            About the verification process →
          </Link>
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
