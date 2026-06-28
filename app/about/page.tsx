import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { OrganizationSchema } from '@/components/schema/OrganizationSchema'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'About ProPilotLicence — DGCA Exam Prep Verified by Airline Captains',
  description: 'ProPilotLicence is a DGCA CPL and ATPL theory exam preparation platform built by pilots, for pilots. Every question reviewed by a panel of four active airline captains.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <OrganizationSchema />
      <SiteHeader right={<Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-primary)', textDecoration: 'none', padding: '5px 4px' }}>Log in</Link>} />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 96px' }}>

        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 24 }}>
          Built by people who&apos;ve sat these exams.
        </h1>

        <div style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--clr-text)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p>
            The DGCA theory examinations have not changed in one important way: you either know the material or you don&apos;t. There is no partial credit above the 70% threshold. There is no second-guessing what the examiner intended. You either pass, or you come back and sit it again — losing months of momentum and thousands of rupees in the process.
          </p>
          <p>
            Most online question banks are compiled from old papers, student memory posts, and AI generation that has never been checked by anyone who actually holds a DGCA licence. That produces questions with wrong answers, misleading distractors, and content that references editions of textbooks from a decade ago.
          </p>
          <p>ProPilotLicence was built to fix that.</p>
        </div>

        <Divider />

        <Section title="The question bank">
          <p>
            Every question on ProPilotLicence is sourced from the officially prescribed DGCA syllabus textbooks — the same books your ground instructor tells you to buy on day one of your CPL programme. Questions are organised by subject, book, and chapter, so you can drill IC Joshi Chapter 8 the night before your Meteorology paper, or work through every Air Regulations question from a specific ICAO Annex without wading through unrelated material.
          </p>
          <p>The question bank currently contains <strong>7,000+ questions</strong> across five CPL subjects, with ATPL coverage expanding continuously.</p>
        </Section>

        <Divider />

        <Section title="The verification panel">
          <p>This is what makes ProPilotLicence different from every other platform in this space.</p>
          <p>
            Before any question enters the question bank, it is reviewed by a panel of four or more active commercial airline captains. These are not retired pilots consulting from memory. They are currently flying commercially on Indian routes, holding valid DGCA CPL and ATPL licences, and sitting in the left seat of aircraft you have flown on.
          </p>
          <p>The panel reviews each question for:</p>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {[
              ['Technical accuracy', 'Is the correct answer actually correct, per current DGCA-prescribed texts and regulations?'],
              ['Distractor quality', 'Are the wrong options plausible enough to test real understanding, without being misleading?'],
              ['Syllabus relevance', 'Does this question test something the DGCA actually examines, or is it a technicality that wastes your revision time?'],
              ['Currency', 'Does the question reflect current DGCA Civil Aviation Requirements, or has a regulatory update made it outdated?'],
            ].map(([label, detail]) => (
              <li key={label} style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--clr-text)' }}>
                <strong>{label}</strong> — {detail}
              </li>
            ))}
          </ul>
          <p>Questions that don&apos;t pass review are revised or rejected. They do not enter the question bank.</p>
          <p>This process is slower than publishing AI output directly. It is also the only reason you can trust what you&apos;re practising.</p>
        </Section>

        <Divider />

        <Section title="Book citations">
          <p>
            Every question on ProPilotLicence cites its source: the textbook, the chapter, and where relevant, the page. When you answer a question incorrectly, you know exactly where to read — not which of your six textbooks might cover it somewhere, but the specific chapter. This is how the platform is designed to work alongside your physical books, not instead of them.
          </p>
        </Section>

        <Divider />

        <Section title="Pricing">
          <p>
            One-time access. No subscription. No auto-renewal. ₹250 for 30 days, ₹599 for 90 days — which covers a full DGCA exam cycle. If you need more time, you pay again. If you pass, you don&apos;t.
          </p>
          <Link
            href="/pricing"
            style={{ display: 'inline-block', marginTop: 8, fontSize: 14, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}
          >
            View pricing →
          </Link>
        </Section>

        <Divider />

        <Section title="Contact">
          <p>For questions about the platform, question accuracy feedback, or institutional enquiries:</p>
          <a
            href="mailto:help@propilotlicence.com"
            style={{ fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}
          >
            help@propilotlicence.com
          </a>
          <p style={{ marginTop: 12 }}>
            Question accuracy feedback is taken seriously. If you believe a question has an incorrect answer or an outdated regulatory reference, report it — it goes directly to the verification panel for review.
          </p>
        </Section>

        <p style={{ marginTop: 48, fontSize: 13, color: 'var(--clr-text-med)', fontStyle: 'italic', borderTop: '1px solid var(--clr-border)', paddingTop: 24 }}>
          ProPilotLicence.com is an independent examination preparation platform and is not affiliated with, endorsed by, or associated with the DGCA, any aviation authority, or any textbook publisher.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--clr-border)', margin: '36px 0' }} />
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.3px', marginBottom: 4 }}>
        {title}
      </h2>
      <div style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--clr-text)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </section>
  )
}
