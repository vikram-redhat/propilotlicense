import Link from 'next/link'
import LandingHeader from '@/components/LandingHeader'
import Breadcrumbs from '@/components/Breadcrumbs'
import SiteFooter from '@/components/SiteFooter'
import { CourseSchema } from '@/components/schema/CourseSchema'
import { buildMetadata } from '@/lib/metadata'
import { bookChapterPractice } from '@/lib/live-counts'
import { HUMAN_PERFORMANCE, humanPerformancePracticeHref } from '@/lib/human-performance'

// Human Performance and Limitations has a subject page of its own, though it's examined in
// the Air Regulations paper as an RK Bali chapter: the same template as /subjects/[subject],
// without the exam stats (it has no paper of its own). The chapter is found by its record,
// so the chapter number, practice link and question count follow the database.

// Question count is live; re-render hourly (a failed refresh keeps the last good page).
export const revalidate = 3600

const TITLE = 'Human Performance and Limitations (Human Factors): DGCA Practice Questions'
const DESCRIPTION = 'Human Performance and Limitations for the DGCA CPL: practice questions organised under RK Bali chapter 23, covering hypoxia, spatial disorientation, vision, fatigue, stress and CRM.'

export const metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: HUMAN_PERFORMANCE.subjectPath })

export default async function HumanPerformanceSubjectPage() {
  const chapter = await bookChapterPractice(HUMAN_PERFORMANCE.bookSlug, HUMAN_PERFORMANCE.chapterId)
  const url = `https://www.propilotlicence.com${HUMAN_PERFORMANCE.subjectPath}`
  const h2 = { fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 12 }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <CourseSchema name="DGCA CPL Human Performance and Limitations" description={DESCRIPTION} url={url} />
      <LandingHeader isLoggedIn={false} name={null} />

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px 96px' }}>
        <Breadcrumbs items={[
          { name: 'Subjects', href: '/subjects' },
          { name: 'Air Regulations', href: '/subjects/air-regulations' },
          { name: 'Human Performance and Limitations' },
        ]} />

        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 12 }}>
          Human Performance and Limitations (Human Factors)
        </h1>
        <p style={{ fontSize: 16, color: 'var(--clr-text-med)', lineHeight: 1.65, marginBottom: 32 }}>
          Human Performance and Limitations, often called human factors, is examined as part of the DGCA Air Regulations paper. It covers how the body and mind affect flying: hypoxia and the effects of altitude, spatial disorientation and illusions, vision, hearing, sleep and fatigue, stress, decision-making and crew resource management. The ProPilotLicence Captain Panel recommends RK Bali, Air Regulations (Eleventh Revised Edition, 2018), chapter {chapter.number}, as the study text.
        </p>

        {/* Stats strip: the live count only (no exam stats: it's examined within Air Regulations) */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
          <div style={{ background: 'var(--clr-surf-alt)', border: '1px solid var(--clr-border)', borderRadius: 8, padding: '10px 16px', minWidth: 100 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--clr-primary)', fontFamily: 'var(--font-outfit),sans-serif' }}>{chapter.questions.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: 'var(--clr-text-med)', marginTop: 2 }}>Practice questions</div>
          </div>
        </div>

        {/* Book */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={h2}>Recommended textbook</h2>
          <Link
            href={`/books/${HUMAN_PERFORMANCE.bookSlug}`}
            style={{ display: 'block', textDecoration: 'none', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 10, padding: '16px 20px' }}
          >
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--clr-text)', marginBottom: 2 }}>
              RK Bali, Air Regulations (Eleventh Revised Edition, 2018), chapter {chapter.number}
            </div>
            <div style={{ fontSize: 13, color: 'var(--clr-primary)', fontWeight: 500 }}>
              View the RK Bali chapter-by-chapter breakdown →
            </div>
          </Link>
        </section>

        {/* Guide */}
        <section style={{ marginBottom: 40 }}>
          <Link href={HUMAN_PERFORMANCE.guidePath} style={{ fontSize: 15, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>
            What to study for Human Performance →
          </Link>
        </section>

        {/* CTA: chapter practice (20 questions, free taster rules), through login if needed */}
        <div style={{ background: 'var(--clr-hero)', borderRadius: 14, padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Start practising Human Performance
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', marginBottom: 20 }}>
            {chapter.questions.toLocaleString()} practice questions, reviewed by active airline captains.
          </p>
          <Link
            href={humanPerformancePracticeHref(chapter.number)}
            data-cta="subject_page"
            style={{ display: 'inline-block', background: 'var(--clr-amber)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontFamily: 'var(--font-outfit),sans-serif' }}
          >
            Practise Human Performance
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
