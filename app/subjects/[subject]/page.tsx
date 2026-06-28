import { notFound } from 'next/navigation'
import Link from 'next/link'
import LandingHeader from '@/components/LandingHeader'
import SiteFooter from '@/components/SiteFooter'
import { CourseSchema } from '@/components/schema/CourseSchema'
import { FAQSchema } from '@/components/schema/FAQSchema'
import { buildMetadata } from '@/lib/metadata'
import { SUBJECTS, getSubjectBySlug } from '@/lib/subjects'

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ subject: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: slug } = await params
  const subject = getSubjectBySlug(slug)
  if (!subject) return {}
  return buildMetadata({
    title: `DGCA CPL ${subject.title} Practice Questions — ${subject.questionCount.toLocaleString()} Questions | ProPilotLicence`,
    description: subject.description,
    path: `/subjects/${slug}`,
  })
}

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: slug } = await params
  const subject = getSubjectBySlug(slug)
  if (!subject) notFound()

  const url = `https://propilotlicence.com/subjects/${subject.slug}`

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <CourseSchema name={`DGCA CPL ${subject.title}`} description={subject.description} url={url} />
      <FAQSchema faqs={[...subject.faqs]} />
      <LandingHeader isLoggedIn={false} name={null} />

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px 96px' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: 'var(--clr-text-med)', marginBottom: 24 }}>
          <Link href="/subjects" style={{ color: 'var(--clr-text-med)', textDecoration: 'none' }}>Subjects</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>{subject.title}</span>
        </nav>

        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 12 }}>
          DGCA CPL {subject.title}
        </h1>
        <p style={{ fontSize: 16, color: 'var(--clr-text-med)', lineHeight: 1.65, marginBottom: 32 }}>
          {subject.description}
        </p>

        {/* Stats strip */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
          {[
            { label: 'Practice questions', value: subject.questionCount.toLocaleString() },
            { label: 'Exam questions', value: `${subject.examQuestions}` },
            { label: 'Exam time', value: `${subject.examMinutes} min` },
            { label: 'Pass mark', value: `${subject.passMarkPct}%` },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'var(--clr-surf-alt)', border: '1px solid var(--clr-border)', borderRadius: 8, padding: '10px 16px', minWidth: 100 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--clr-primary)', fontFamily: 'var(--font-outfit),sans-serif' }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--clr-text-med)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* High-yield topics */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 12 }}>
            High-yield topics
          </h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {subject.topicsHighYield.map((t) => (
              <span
                key={t}
                style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-primary)', background: 'var(--clr-pri-light)', borderRadius: 20, padding: '4px 12px', border: '1px solid var(--clr-border)' }}
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Primary book */}
        {subject.primaryBookSlug && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 12 }}>
              DGCA-prescribed textbook
            </h2>
            <Link
              href={`/books/${subject.primaryBookSlug}`}
              style={{ display: 'block', textDecoration: 'none', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 10, padding: '16px 20px' }}
            >
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--clr-text)', marginBottom: 2 }}>{subject.primaryBookLabel}</div>
              <div style={{ fontSize: 13, color: 'var(--clr-primary)', fontWeight: 500 }}>
                View chapter-by-chapter breakdown and practice questions →
              </div>
            </Link>
          </section>
        )}

        {/* CTA */}
        <div style={{ background: 'var(--clr-hero)', borderRadius: 14, padding: '28px 24px', marginBottom: 48, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Start practising {subject.shortTitle}
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', marginBottom: 20 }}>
            {subject.questionCount.toLocaleString()} practice questions, reviewed by active airline captains. First 10 free, no sign-up required.
          </p>
          <Link
            href="/login"
            style={{ display: 'inline-block', background: 'var(--clr-amber)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontFamily: 'var(--font-outfit),sans-serif' }}
          >
            Practise free
          </Link>
        </div>

        {/* FAQs */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 20 }}>
            Frequently asked questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {subject.faqs.map((faq, i) => (
              <div
                key={i}
                style={{ padding: '20px 0', borderBottom: i < subject.faqs.length - 1 ? '1px solid var(--clr-border)' : 'none' }}
              >
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--clr-text)', marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--clr-text-med)' }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
