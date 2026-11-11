import Link from 'next/link'
import LandingHeader from '@/components/LandingHeader'
import { Breadcrumb } from '@/components/guides/ArticleKit'
import { getHeaderAuthState } from '@/lib/supabase-server'
import { bookQuestionTotalOrNull, questionTotalsOrFallback, roundedTotal } from '@/lib/live-counts'
import { chapterList, loadIcJoshiSyllabus } from '@/lib/ic-joshi-syllabus'
import SiteFooter from '@/components/SiteFooter'
import { ArticleSchema } from '@/components/schema/ArticleSchema'
import { buildMetadata } from '@/lib/metadata'
import { Section, SubSection } from '@/components/guides/ArticleKit'
import { getPost } from '@/lib/guides'
import BvnNotice from '@/components/BvnNotice'

// Dates come from the guide registry, so the Article schema and the sitemap agree.
const POST = getPost('dgca-exam-guides', 'dgca-cpl-books')!

export const metadata = buildMetadata({
  title: 'Which Books to Study for DGCA CPL Exams — Complete 2026 Guide | ProPilotLicence',
  description:
    'The complete guide to DGCA-prescribed textbooks for CPL theory exams. Which books to buy for Meteorology, Air Regulations, Navigation, Technical General, and Radio Aids — reviewed by active airline captains.',
  path: '/guides/dgca-exam-guides/dgca-cpl-books',
})

export default async function DgcaCplBooksPost() {
  const [{ isLoggedIn, name }, totals, joshiTotal, baliTotal, joshiSyllabus] = await Promise.all([
    getHeaderAuthState(), questionTotalsOrFallback(),
    bookQuestionTotalOrNull('ic-joshi-aviation-meteorology'), bookQuestionTotalOrNull('rk-bali-air-regulations'),
    // A failed hourly refresh serves the last good data; with nothing cached and the
    // database down, the IC Joshi priorities fall back to a link to the book page.
    loadIcJoshiSyllabus().catch(e => { console.error(e); return null }),
  ])
  // IC Joshi priorities follow the Captain Panel's exam weights: the High chapters, with
  // an editorial note for those that have one.
  const joshiHigh = (joshiSyllabus ?? []).filter(c => c.weight === 'High')
  // Shown below the High list while Climatology India isn't itself rated High.
  const climatology = joshiSyllabus?.find(c => c.number === 19)
  const count = (n: number | null) => (n != null ? `${n.toLocaleString()} ` : '')
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <ArticleSchema
        title="Which Books Should I Study for the DGCA CPL Theory Exams? (2026 Guide)"
        description="The complete guide to DGCA-prescribed textbooks for CPL theory exams. Which books to buy for Meteorology, Air Regulations, Navigation, Technical General, and Radio Aids."
        url="https://www.propilotlicence.com/guides/dgca-exam-guides/dgca-cpl-books"
        publishedAt={POST.publishedAt}
        updatedAt={POST.updatedAt}
      />
      <LandingHeader isLoggedIn={isLoggedIn} name={name} />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 96px' }}>

        {/* Breadcrumb */}
        <Breadcrumb seriesSlug="dgca-exam-guides" seriesLabel="DGCA Exam Guides" current="DGCA CPL Books Guide" />

        {/* Meta */}
        <div style={{ fontSize: 12, color: 'var(--clr-text-med)', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span>Reviewed by ProPilotLicence Captain Panel</span>
          <span>·</span>
          <span>Updated {new Date(POST.updatedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 30, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 16 }}>
          Which Books Should I Study for the DGCA CPL Theory Exams?
        </h1>

        <div style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--clr-text)', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
          <p>
            The DGCA prescribes specific textbooks for each CPL theory subject. These are not suggestions — they are the books the examiner has studied when designing the paper. Candidates who study primarily from non-prescribed international books risk covering content the DGCA does not test while missing content it tests heavily.
          </p>
          <p>
            This guide covers the primary prescribed book for each subject, what each book contains, and the chapters that matter most for the exam.
          </p>
        </div>

        <Section title="Aviation Meteorology — IC Joshi" first>
          <p>
            <strong>Aviation Meteorology</strong> by Group Captain IC Joshi (IAF, Retd.) is one prescribed Indian text that covers Indian climatology, the monsoon system, and subcontinent-specific weather phenomena in the depth the DGCA tests.
          </p>
          <p>
            This is the most important book distinction for Meteorology candidates: international textbooks (ATPL Oxford, JAA ground studies) are thorough on European and North Atlantic weather however, slightly light on Indian climatology. The DGCA Meteorology paper regularly includes questions from Chapter 19 (Climatology India) and Chapter 13 (Thunderstorm), both of which Joshi covers in depth.
          </p>
          <SubSection title="Chapters to prioritise">
            {joshiSyllabus ? <>
              <p>The ProPilotLicence Captain Panel rates Chapters {chapterList(joshiHigh.map(c => c.number))} High exam weight.</p>
              <ChapterList items={joshiHigh.filter(c => JOSHI_NOTES[c.number]).map(c => [`Chapter ${c.number} — ${c.name}`, JOSHI_NOTES[c.number]] as [string, string])} />
              {(climatology?.weight === 'Medium' || climatology?.weight === 'Low') && (
                <p>Chapter 19, Climatology India, is rated {climatology.weight}, but it is the chapter that separates candidates using Joshi from those using international texts only.</p>
              )}
            </> : (
              <p><Link href="/books/ic-joshi-aviation-meteorology" style={{ color: 'var(--clr-primary)', fontWeight: 600, textDecoration: 'none' }}>See the IC Joshi chapter breakdown, with the panel&apos;s exam weights →</Link></p>
            )}
          </SubSection>
          <p>
            ProPilotLicence has{' '}
            <Link href="/books/ic-joshi-aviation-meteorology" style={{ color: 'var(--clr-primary)', fontWeight: 600, textDecoration: 'none' }}>
              {count(joshiTotal)}Meteorology practice questions
            </Link>
            , organised by IC Joshi&apos;s chapters.
          </p>
        </Section>

        <Section title="Air Regulations — RK Bali">
          <BvnNotice style={{ marginBottom: 16 }} />
          <p>
            <strong>Air Regulations for CPL/ATPL</strong> by Wing Commander RK Bali (IAF, Retd.) is the standard prescribed text for the DGCA Air Regulations paper. It covers all 18 ICAO Annexes as applicable to Indian operations, DGCA Civil Aviation Requirements, Rules of the Air, licensing, and ATC procedures.
          </p>
          <p>
            Air Regulations fails more candidates than any other CPL subject. The syllabus is broad — 18 ICAO Annexes plus the full body of DGCA CARs — and the DGCA tests precise regulatory values, not general understanding. Vague familiarity does not pass this paper.
          </p>
          <SubSection title="Chapters to prioritise">
            <ChapterList items={[
              ['Chapter 5 — Licensing', 'The most consistently tested chapter. CPL vs ATPL privileges, recency requirements, and medical class requirements must be known precisely.'],
              ['Chapter 6 — Rules of the Air', 'Right-of-way hierarchy and VFR minima by airspace class appear in virtually every paper.'],
              ['Chapter 7 — Air Traffic Services', 'Communication failure procedures are tested specifically — the sequence and transponder code matter.'],
              ['Chapter 11 — Accident Investigation', 'Annex 13 definitions (accident, serious incident, incident) are tested exactly. Learn them word-for-word.'],
            ]} />
          </SubSection>
          <p>
            For content updated after your edition of Bali, supplement with current DGCA CARs from the{' '}
            <span style={{ fontWeight: 500 }}>DGCA website</span> (free download). ProPilotLicence Air Regulations questions are reviewed against current CARs before publication.
          </p>
          <p>
            ProPilotLicence has{' '}
            <Link href="/books/rk-bali-air-regulations" style={{ color: 'var(--clr-primary)', fontWeight: 600, textDecoration: 'none' }}>
              {count(baliTotal)}practice questions sourced from RK Bali
            </Link>
            , organised by chapter.
          </p>
        </Section>

        <Section title="Air Navigation — DP Khanna and RK Bali">
          <p>
            Air Navigation has two commonly used prescribed texts: <strong>Air Navigation</strong> by Group Captain DP Khanna and <strong>Navigation for Pilots</strong> by RK Bali. Most candidates use both — Khanna as the primary text and Bali for its worked examples.
          </p>
          <p>
            Navigation is the heaviest paper (100 questions for CPL and 90 for ATPL, 180 minutes) and includes both conceptual and numerical questions. The wind triangle, 1-in-60 rule, and fuel endurance calculations must be executable accurately under exam conditions.
          </p>
          <SubSection title="High-yield topics">
            <ChapterList items={[
              ['Wind triangle calculations', 'Appear in every paper. Must be executable without a CRP-5 in some question formats.'],
              ['1-in-60 rule', 'Track angle error and closing angle calculations — reliable source of marks when practised.'],
              ['Chart projections', 'Mercator vs Lambert Conformal properties, including convergency and scale variation.'],
              ['VOR/DME navigation', 'Track interception and bearing interpretation appear regularly.'],
              ['Mass and balance', 'CG calculation and limits — always in the paper.'],
            ]} />
          </SubSection>
        </Section>

        <Section title="Technical General — AK Garg">
          <p>
            <strong>Aircraft General Engineering and Maintenance Practices</strong> by AK Garg is the standard Indian reference for the DGCA Technical General paper. Candidates wanting more engineering depth often supplement with the Oxford Aviation Academy Airframes and Systems and Powerplant volumes.
          </p>
          <p>
            Technical General rewards understanding over memorisation. Study each system (hydraulic, electrical, pressurisation, fuel) by understanding how it works and what happens when components fail — the DGCA tests application, not definition.
          </p>
        </Section>

        <Section title="Radio Aids and Instruments — RK Bali">
          <p>
            <strong>Radio Aids</strong> by RK Bali is the primary prescribed text for the Radio Aids and Instruments paper. The Oxford Aviation Academy Radio Navigation volume is used by candidates wanting additional depth on ILS, VOR error analysis, and GNSS principles.
          </p>
          <p>
            The DGCA has increased GPS and GNSS-related content in the Radio Aids paper in recent years. Candidates using older study materials should ensure GNSS coverage is current.
          </p>
        </Section>

        <Section title="A note on buying books">
          <p>
            Indian aviation textbooks have limited distribution. The most reliable sources are the publishers directly or established aviation bookshops. Photocopied editions circulate widely in flying clubs — while the content is the same, note that edition dates matter for Air Regulations (older editions may have outdated CARs).
          </p>
          <p>
            Questions on ProPilotLicence are always reviewed against the current DGCA-prescribed edition of each textbook before publication.
          </p>
        </Section>

        <div style={{ marginTop: 48, padding: '24px', background: 'var(--clr-pri-light)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--clr-text)' }}>
            Practice questions from these books
          </div>
          <p style={{ fontSize: 14, color: 'var(--clr-text-med)', lineHeight: 1.65, margin: 0 }}>
            ProPilotLicence has {roundedTotal(totals.cpl)} questions sourced from DGCA-prescribed textbooks, organised by subject and chapter, and reviewed by active airline captains.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
            <Link href="/books/ic-joshi-aviation-meteorology" data-cta="guide" style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>IC Joshi — Meteorology →</Link>
            <Link href="/books/rk-bali-air-regulations" data-cta="guide" style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>RK Bali — Air Regulations →</Link>
            <Link href="/subjects" data-cta="guide" style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>All subjects →</Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

// Editorial notes for IC Joshi chapters, shown when the chapter is rated High.
const JOSHI_NOTES: Record<number, string> = {
  13: 'A High-weight chapter that draws on stability, clouds, icing and winds. Study every section.',
  19: 'The chapter that separates candidates using Joshi from those using international texts only.',
  14: 'Frontal sequences produce consistent questions.',
}

function ChapterList({ items }: { items: [string, string][] }) {
  return (
    <ul style={{ paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', margin: 0 }}>
      {items.map(([title, desc]) => (
        <li key={title} style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--clr-text)', paddingLeft: 16, borderLeft: '3px solid var(--clr-primary)' }}>
          <strong>{title}</strong> — {desc}
        </li>
      ))}
    </ul>
  )
}
