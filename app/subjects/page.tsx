import Link from 'next/link'
import LandingHeader from '@/components/LandingHeader'
import SiteFooter from '@/components/SiteFooter'
import { buildMetadata } from '@/lib/metadata'
import { SUBJECTS } from '@/lib/subjects'
import { getHeaderAuthState } from '@/lib/supabase-server'

export const metadata = buildMetadata({
  title: 'DGCA CPL & ATPL Exam Subjects — Practice Questions | ProPilotLicence',
  description:
    'Practice questions for all DGCA CPL and ATPL theory exam subjects — plus a full Airbus A320 question bank covering every ATA chapter. Verified by active airline captains.',
  path: '/subjects',
})

const sectionLabel = {
  fontFamily: 'var(--font-outfit),sans-serif',
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  color: 'var(--clr-text-med)',
  marginBottom: 14,
}

export default async function SubjectsPage() {
  const { isLoggedIn, name, examType } = await getHeaderAuthState()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <LandingHeader isLoggedIn={isLoggedIn} name={name} examType={examType} />

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px 96px' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 8 }}>
          DGCA CPL &amp; ATPL Theory Exam Subjects
        </h1>
        <p style={{ fontSize: 16, color: 'var(--clr-text-med)', lineHeight: 1.6, marginBottom: 48 }}>
          Practice questions for all DGCA CPL and ATPL theory exam subjects — organised by book and chapter, verified by a panel of active airline captains.
        </p>

        {/* CPL subjects */}
        <div style={sectionLabel}>CPL Theory Subjects</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SUBJECTS.map((s) => (
            <Link
              key={s.slug}
              href={`/subjects/${s.slug}`}
              style={{ display: 'block', textDecoration: 'none', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 12, padding: '20px 24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 4 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--clr-text-med)' }}>
                    {s.examQuestions} questions · {s.examMinutes} minutes · {s.passMarkPct}% to pass
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--clr-primary)', fontFamily: 'var(--font-outfit),sans-serif' }}>
                    {s.questionCount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--clr-text-med)', marginTop: 1 }}>practice questions</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ATPL — Airbus A320 */}
        <div style={{ ...sectionLabel, marginTop: 40 }}>ATPL — Airbus A320 Family</div>
        <Link
          href="/login?next=/atpl"
          style={{ display: 'block', textDecoration: 'none', background: 'var(--clr-pri-light)', border: '1.5px solid var(--clr-primary)', borderRadius: 12, padding: '20px 24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--clr-text)' }}>
                  Airbus A320 Family
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', background: 'var(--clr-primary)', color: '#fff', padding: '2px 7px', borderRadius: 5 }}>
                  New
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--clr-text-med)' }}>320 / 319 / 321 · XLR · NEO · CEO</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--clr-primary)', fontFamily: 'var(--font-outfit),sans-serif' }}>1,631</div>
              <div style={{ fontSize: 11, color: 'var(--clr-text-med)', marginTop: 1 }}>practice questions</div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--clr-text-med)', lineHeight: 1.65, margin: '14px 0 0' }}>
            Full ATPL question bank covering every ATA chapter — Air Conditioning, Pressurisation, Autoflight, Electrical, Flight Controls, Fuel, Hydraulics, Ice &amp; Rain Protection, Landing Gear, Engines, APU, and more. Questions verified by active airline captains currently flying the A320 family.
          </p>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--clr-primary)', marginTop: 14 }}>
            Practise A320 questions →
          </div>
        </Link>

        {/* Captain verification (kept as-is, moved above the CTA) */}
        <div style={{ marginTop: 40, padding: '24px', background: 'var(--clr-pri-light)', borderRadius: 12 }}>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--clr-text)', margin: 0 }}>
            Every question is sourced from DGCA-prescribed textbooks and verified by a panel of four or more active commercial airline captains before entering the question bank.{' '}
            <Link href="/about" style={{ color: 'var(--clr-primary)', fontWeight: 600, textDecoration: 'none' }}>Learn more about the verification process →</Link>
          </p>
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 24, background: 'var(--clr-hero)', borderRadius: 14, padding: '28px 32px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-outfit),sans-serif' }}>Ready to start?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 20, lineHeight: 1.6, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
            Free to begin — no credit card required. Choose your subjects and start practising immediately.
          </p>
          <Link href="/signup" style={{ display: 'inline-block', background: '#fff', color: 'var(--clr-hero)', fontWeight: 700, fontSize: 14, padding: '11px 28px', borderRadius: 8, textDecoration: 'none' }}>
            Sign up free →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
