import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { buildMetadata } from '@/lib/metadata'
import { SUBJECTS } from '@/lib/subjects'

export const metadata = buildMetadata({
  title: 'DGCA CPL Exam Subjects — Practice Questions | ProPilotLicence',
  description:
    'Practice questions for all five DGCA CPL theory exam subjects: Aviation Meteorology, Air Regulations, Air Navigation, Technical General, and Radio Aids and Instruments.',
  path: '/subjects',
})

export default function SubjectsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <SiteHeader right={<Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-primary)', textDecoration: 'none', padding: '5px 4px' }}>Log in</Link>} />

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px 96px' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 8 }}>
          DGCA CPL Theory Exam Subjects
        </h1>
        <p style={{ fontSize: 16, color: 'var(--clr-text-med)', lineHeight: 1.6, marginBottom: 48 }}>
          Practice questions for all five CPL subjects — organised by book and chapter, reviewed by active airline captains.
        </p>

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

        <div style={{ marginTop: 56, padding: '24px', background: 'var(--clr-pri-light)', borderRadius: 12 }}>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--clr-text)', margin: 0 }}>
            Every question is sourced from DGCA-prescribed textbooks and verified by a panel of four or more active commercial airline captains before entering the question bank.{' '}
            <Link href="/about" style={{ color: 'var(--clr-primary)', fontWeight: 600, textDecoration: 'none' }}>Learn more about the verification process →</Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
