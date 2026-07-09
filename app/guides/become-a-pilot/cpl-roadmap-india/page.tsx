import LandingHeader from '@/components/LandingHeader'
import { getHeaderAuthState } from '@/lib/supabase-server'
import SiteFooter from '@/components/SiteFooter'
import { ArticleSchema } from '@/components/schema/ArticleSchema'
import { buildMetadata } from '@/lib/metadata'
import { seriesNavItems, getSeries } from '@/lib/guides'
import {
  Breadcrumb, ArticleHeader, SeriesNav, Section, SubSection, Prose, Callout,
  DataTable, FinancialTable, StepList, Roadmap, ComparisonGrid, CtaBlock, Disclaimer,
} from '@/components/guides/ArticleKit'

export const metadata = buildMetadata({
  title: 'How to Become a Pilot in India — The Complete CPL Roadmap | ProPilotLicence',
  description:
    'The complete step-by-step guide to becoming a commercial pilot in India. From 12th standard to CPL — eligibility, medicals, SPL, flight training, DGCA theory exams, costs, timelines, and training abroad.',
  path: '/guides/become-a-pilot/cpl-roadmap-india',
})

const SERIES = getSeries('become-a-pilot')!
const ARTICLE_INDEX = SERIES.posts.findIndex(p => p.slug === 'cpl-roadmap-india')

export default async function CplRoadmapIndiaPost() {
  const { isLoggedIn, name } = await getHeaderAuthState()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <ArticleSchema
        title="How to Become a Pilot in India — The Complete CPL Roadmap"
        description="The complete step-by-step guide to becoming a commercial pilot in India. From 12th standard to CPL — eligibility, medicals, SPL, flight training, DGCA theory exams, costs, timelines, and training abroad."
        url="https://propilotlicence.com/guides/become-a-pilot/cpl-roadmap-india"
        publishedAt="2026-07-09"
        updatedAt="2026-07-09"
      />
      <LandingHeader isLoggedIn={isLoggedIn} name={name} />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 96px' }}>
        <Breadcrumb seriesSlug="become-a-pilot" seriesLabel="Become a Pilot" current="The Complete CPL Roadmap" />

        <ArticleHeader
          seriesLabel="Become a Pilot India"
          articleNumber={ARTICLE_INDEX + 1}
          totalArticles={SERIES.posts.length}
          title="How to Become a Pilot in India — The Complete CPL Roadmap"
          standfirst="Every year, thousands of people in India decide they want to fly commercially. Most of them spend the next six months researching without a clear picture of what the path actually looks like. This is that picture — from eligibility check to CPL in hand, with honest numbers at every stage."
        />

        <SeriesNav seriesLabel="Become a Pilot India" items={seriesNavItems('become-a-pilot', 'cpl-roadmap-india')} />

        <Prose>
          <p>The commercial pilot career in India is genuinely one of the most demanding things a person can pursue — demanding in terms of money, time, focus, and the unforgiving nature of the selection system at the end of it. It is also, for people who complete it and get into the left seat of a commercial aircraft for the first time, exactly what they spent years working toward.</p>
          <p>This article does not romanticise the path. It maps it.</p>
        </Prose>

        <Section title="The complete journey at a glance" first>
          <Prose>
            <p>Before going into the detail of each step, here is the full CPL journey mapped as a timeline — from the day you decide to the day you hold a licence in your hand.</p>
          </Prose>

          <Roadmap
            label="The CPL roadmap — India"
            caption="Steps 6A (theory exams) and 6B (200 flight hours) run concurrently — you do not need to complete all theory before starting to fly, or vice versa. All theory must be passed before the skills test."
            stages={[
              { n: '1', title: 'Check eligibility', detail: '10+2 with PCM · Age 17+ · Indian citizen or OCI cardholder.', time: 'Week 1', cost: 'Free' },
              { n: '2', title: 'Class 1 medical', detail: 'AFCME / IAM. Do this before paying any FTO a rupee.', time: '6–10 weeks', cost: '₹15,000–40,000' },
              { n: '3', title: 'eGCA registration', detail: 'DGCA Computer Number + Permanent Medical Record.', time: '1–2 weeks', cost: 'Nominal' },
              { n: '4', title: 'Select a DGCA-approved FTO', detail: 'Research · visit in person · verify fleet availability.', time: '1–3 months', cost: 'Travel only' },
              { n: '5', title: 'Student Pilot Licence', detail: 'Applied via eGCA. Class 2 medical required.', time: '2–4 weeks', cost: 'Government fee' },
              {
                n: '6',
                title: 'Theory exams + flight training',
                detail: 'These two run concurrently over 18–36 months.',
                time: '18–36 months',
                cost: '',
                done: true,
                split: [
                  { title: 'Theory exams', detail: '5 subjects + RTR(A). 70% pass mark each.', cost: '₹2,500–3,000/subject' },
                  { title: '200 flight hours', detail: 'Solo · cross-country · instrument · night flying.', cost: '₹40–55 lakhs' },
                ],
              },
              { n: '7', title: 'CPL skills test', detail: 'DGCA examiner. All theory must be passed first.', time: 'One day', cost: 'Examiner fee' },
              { n: '✓', title: 'CPL issued via eGCA', detail: 'You are a licensed commercial pilot. Total: roughly 3 years, ₹55–70L.', time: 'Total ~3 years', cost: '₹55–70L total', done: true },
            ]}
          />
        </Section>

        <Section title="Step 1 — Are you eligible?">
          <Prose>
            <p>The DGCA&apos;s eligibility requirements for CPL training are straightforward, but there is one that catches people out more often than the others.</p>
            <p><strong>Age:</strong> You must be at least 17 to hold a Student Pilot Licence and at least 18 to hold a CPL. There is no upper age limit for training, but the age calculation matters for airline hiring — see the section below on age.</p>
            <p><strong>Education:</strong> 10+2 (or equivalent) with Physics, Chemistry, and Mathematics from a recognised board. This is the most common eligibility gap for people considering a change of direction — if your 12th standard subjects did not include Physics and Mathematics, you need to clear them before CPL training can begin. The NIOS (National Institute of Open Schooling) route is available and accepted by DGCA. It adds approximately 6–12 months but does not close the path.</p>
            <p><strong>Citizenship:</strong> Indian citizen or OCI cardholder. DGCA pilot licences are not available to foreign nationals.</p>
            <p><strong>English proficiency:</strong> ICAO Level 4 minimum. For most Indian candidates with standard schooling, this is not a barrier — but it is a formal requirement and is assessed during the licence process.</p>
          </Prose>

          <Callout variant="amber">
            <strong>Check your 10+2 certificate before spending a rupee.</strong> Open it now. If Physics and Mathematics are on it: clear. If not: start NIOS immediately, before medicals, before FTO visits, before anything else. This is your critical path item.
          </Callout>
        </Section>

        <Section title="Step 2 — The medical, and why it comes first">
          <Prose>
            <p>Get your DGCA Class 1 medical before you pay a flying school anything. This is not a bureaucratic recommendation — it is the most important practical advice in this entire article.</p>
            <p>Approximately one in eight CPL candidates discovers a medical condition that affects their flying eligibility after paying enrolment fees at a flying school. At ₹55–70 lakhs total investment, the medical is an inexpensive first gate. Go through it before anything costs serious money.</p>
            <p>The sequence is:</p>
            <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20, margin: 0 }}>
              <li><strong>Class 2 medical first</strong> — with a DGCA-approved aviation medical examiner in your city. Costs approximately ₹3,000–7,000. This generates your Permanent Medical Record (PMR) number and eGCA identity, both of which you need for everything that follows.</li>
              <li><strong>Class 1 medical second</strong> — conducted only at DGCA-approved centres: AFCME in New Delhi, IAM in Bangalore, and a small number of other empanelled civil hospitals. Book through the eGCA portal at egca.gov.in. Appointments take 30–60 days to secure. Cost: ₹10,000–30,000 at the centre, plus travel and accommodation.</li>
            </ol>
            <p>The Class 1 medical covers: vision (including colour vision), hearing, cardiovascular function (ECG, blood pressure), neurological assessment, and general health. The DGCA standards are specific and non-negotiable. Conditions that do not prevent you from working in most careers — certain cardiovascular conditions, some vision limitations, specific neurological histories — can disqualify you as a pilot. If you have any existing medical history, consult an aviation medical examiner for a preliminary opinion before booking your formal Class 1 appointment.</p>
          </Prose>

          <Callout variant="red">
            <strong>Colour vision matters specifically.</strong> The DGCA requires that pilots are not colour blind in ways that would impair their ability to distinguish navigation lights or instrument displays. Not all forms of colour vision deficiency disqualify — but some do. Get assessed before paying for training.
          </Callout>
        </Section>

        <Section title="Step 3 — eGCA registration and your DGCA Computer Number">
          <Prose>
            <p>Register on the eGCA portal at egca.gov.in and obtain your DGCA Computer Number. This is your permanent identifier for all DGCA examinations, medical records, and licence applications. Nothing proceeds without it. It is typically generated during the Class 2 medical process — the examiner submits your details and DGCA issues your Computer Number. Once you have it, keep it.</p>
          </Prose>
        </Section>

        <Section title="Step 4 — Choosing a Flying Training Organisation">
          <Prose>
            <p>This is the decision that most directly determines whether your training takes 24 months or 48. Choose well here and the rest of the programme flows. Choose badly and you can spend years waiting for aircraft that are not available.</p>
            <p>Only DGCA-approved FTOs count. Flying hours at an unapproved school are not recognised toward your CPL. The DGCA maintains the approved list on its website — verify before enrolling.</p>
            <p>The questions to ask every FTO you visit:</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 20, margin: 0 }}>
              <li><strong>How many students are currently enrolled?</strong> And how many aircraft are on the approved fleet?</li>
              <li><strong>What is the current student-to-aircraft ratio?</strong> More than 8–10 students per aircraft means queuing.</li>
              <li><strong>What was the average time to complete 200 hours</strong> for students who finished in the last 12 months? Not the brochure estimate — actual completion data.</li>
              <li><strong>What is the aircraft serviceability rate?</strong> Grounded aircraft means your roster doesn&apos;t fly.</li>
              <li><strong>What is the CPL skills test first-attempt pass rate?</strong> This reflects training quality.</li>
            </ul>
          </Prose>

          <Callout variant="blue">
            <strong>Visit in person before you sign anything.</strong> Walk the ramp. Look at the aircraft. Talk to students who are mid-programme — not to the admissions officer. The most important information about an FTO is not in its brochure; it&apos;s in the experience of the students currently enrolled there.
          </Callout>

          <SubSection title="Training in India vs training abroad">
            <Prose>
              <p>Training abroad is a genuine and commonly used option, not a shortcut. Many licensed Indian commercial pilots trained in the Philippines, the United States, or South Africa before converting their foreign licence to a DGCA licence on return. Here is an honest comparison.</p>
            </Prose>

            <ComparisonGrid
              cards={[
                {
                  title: 'Training in India',
                  flag: '🇮🇳',
                  points: [
                    'Cost: ₹45–60L for flying hours',
                    'Duration: 24–36 months (FTO-dependent)',
                    'CPL issued directly by DGCA — no conversion required',
                    'Variable aircraft availability',
                    'Familiar environment and language',
                    'DGCA oversight throughout',
                  ],
                },
                {
                  title: 'Training abroad',
                  flag: '🌏',
                  points: [
                    'Cost: ₹35–55L+ (currency risk)',
                    'Duration: often faster (18–24 months)',
                    'Foreign CPL must be converted to a DGCA licence',
                    'Conversion means additional exams and checks',
                    'Better aircraft availability, typically',
                    'Confirm the DGCA conversion path before enrolling',
                  ],
                },
                {
                  title: 'Philippines',
                  flag: '🇵🇭',
                  points: [
                    'Most popular overseas destination for Indian CPL candidates',
                    'CAAP → DGCA conversion is well-established',
                    'English instruction throughout',
                    'Lower cost of living than most Western alternatives',
                    'Good weather flying conditions year-round',
                  ],
                },
                {
                  title: 'USA / South Africa',
                  flag: '🇺🇸',
                  points: [
                    'USA: FAA CPL, DGCA conversion required on return',
                    'High-quality training infrastructure in the USA',
                    'South Africa: CAA CPL, conversion required',
                    'South Africa lower cost than the USA, good conditions',
                    'Both have well-established conversion paths to DGCA',
                    'Factor in visa requirements for the USA',
                  ],
                },
              ]}
            />

            <Callout variant="amber">
              <strong>If training abroad:</strong> Before enrolling at any overseas FTO, confirm with DGCA (in writing via eGCA) that the foreign licence you will receive is eligible for conversion to a DGCA CPL. Conversion requirements can change. Don&apos;t rely on the FTO&apos;s assurance — get it directly from DGCA.
            </Callout>
          </SubSection>
        </Section>

        <Section title="Steps 5–7 — SPL, training, exams, and the skills test">
          <Prose>
            <p>Once your FTO is selected and fees are paid, the programme begins with the Student Pilot Licence and proceeds through flight training and theory examinations running concurrently.</p>
          </Prose>

          <StepList steps={[
            {
              title: 'Student Pilot Licence (SPL)',
              body: 'Your first DGCA licence. Applied via eGCA using your Computer Number and Class 2 medical certificate. Permits you to fly under instructor supervision. This is the formal start of your flying career — your first entry in your pilot logbook will carry the SPL number.',
              tags: [{ label: 'Timeline: 2–4 weeks to process', variant: 'time' }, { label: 'Cost: Government fee only', variant: 'cost' }],
            },
            {
              title: 'DGCA theory examinations',
              body: 'Five subjects, all conducted online via the DGCA Pariksha portal. You must pass all five — plus the RTR(A) — before sitting your CPL skills test. Each requires a 70% pass mark. You can attempt subjects in any order and sit them at any point during your training. The five subjects: Aviation Meteorology, Air Regulations, Air Navigation, Technical General, and Radio Aids and Instruments. The RTR(A) — Radio Telephony Restricted (Aeronautical) — is a separate licence administered by DGCA, applied for through eGCA.',
              tags: [{ label: 'Timeline: 6–18 months', variant: 'time' }, { label: 'Cost: ₹2,500–3,000 per subject + ground school ₹1.5–3L', variant: 'cost' }],
            },
            {
              title: '200 hours of DGCA-approved flight training',
              body: 'The core of the programme. The DGCA requires a minimum of 200 hours of flight time including a minimum number of solo hours, cross-country hours (including a qualifying solo cross-country flight), instrument hours (partial and full panel), and night flying hours. Progress typically follows: dual instruction → supervised solo → solo consolidation → advanced dual (instrument, navigation, night) → supervised cross-country → CPL standard practice. Each phase has specific requirements before progression.',
              tags: [{ label: 'Timeline: 18–36 months depending on FTO', variant: 'time' }, { label: 'Cost: ₹40–55 lakhs — the largest single cost', variant: 'cost' }, { label: 'Runs concurrently with theory exams', variant: 'action' }],
            },
            {
              title: 'CPL skills test',
              body: 'Conducted by a DGCA examiner in your training aircraft. Tests your practical flying ability across the areas covered during training: instrument flying, navigation, airmanship, emergency procedures, and general aircraft handling. All five theory subjects and the RTR(A) must be passed before this test can be attempted, and your Class 1 medical must be current. Your FTO will prepare you specifically for the skills test format in the final weeks before the attempt.',
              tags: [{ label: 'Timeline: One day', variant: 'time' }, { label: 'Cost: DGCA examiner fee + aircraft time', variant: 'cost' }],
            },
          ]} />

          <Prose>
            <p>After the skills test, you apply for CPL issue through the eGCA portal. Processing typically takes 2–4 weeks. Your CPL is issued as a digital document with a QR code — the physical card is also issued by DGCA.</p>
          </Prose>
        </Section>

        <Section title="The age question — read this carefully">
          <Prose>
            <p>The DGCA has no upper age limit for pilot training. That is legally accurate and practically incomplete.</p>
            <p>Major Indian commercial airlines — IndiGo, Air India, SpiceJet, Akasa Air — have consistent informal preferences for first officer candidates who will have at least 20 years of service before the mandatory retirement age of 65. This means the market preference is for candidates who complete their CPL and begin airline employment before their mid-thirties.</p>
            <p>If you are 18 today, you have the full runway. If you are 28 and seriously considering this, the window is still clearly open — complete training by 31 and you have 34 years of potential service ahead. If you are 36 and beginning to think about it, the path is still available but narrower — and the financial case requires more careful consideration against a shorter career horizon.</p>
            <p>This is not a reason to dismiss the idea at 35. It is a reason to have an honest conversation with yourself about the destination before committing ₹55–70 lakhs to the journey.</p>
          </Prose>
        </Section>

        <Section title="What it costs — honest total figures">
          <FinancialTable
            heading="What CPL training costs — approximate figures, India 2026"
            rows={[
              ['Medical (Class 2 + Class 1)', { value: '₹15,000–40,000', variant: 'mono' }, 'Do first, before anything else.'],
              ['eGCA registration + SPL', { value: 'Nominal', variant: 'pos' }, 'Government fees only.'],
              ['FTO enrolment + flying training (India)', { value: '₹45–60 lakhs', variant: 'neg' }, 'Largest single cost — varies significantly by FTO.'],
              ['Ground school', { value: '₹1.5–3 lakhs', variant: 'mono' }, 'Some FTOs include this, some charge separately.'],
              ['Theory exam fees (5 subjects + RTR)', { value: '₹18,000–24,000', variant: 'mono' }, 'Plus re-sit fees if any subjects require a repeat.'],
              ['Skills test fee + aircraft time', { value: '₹40,000–80,000', variant: 'mono' }, 'Varies by aircraft type and examiner.'],
              ['Living costs during training', { value: '₹6–18 lakhs', variant: 'mono' }, 'Depends on location, lifestyle, FTO accommodation.'],
              ['Total (India-based training)', { value: '₹55–75 lakhs', variant: 'neg' }, 'Budget conservatively — unexpected costs arise.'],
            ]}
          />

          <Prose>
            <p>These are 2026 figures. Training costs have risen steadily over the past decade and are likely to continue rising. Budget at the higher end of each range and treat the lower end as a best case, not an expectation.</p>
          </Prose>
        </Section>

        <Section title="How CPL candidates fund their training">
          <Prose>
            <p>There is no government scholarship or subsidy specifically for CPL training in India. Funding options used by candidates include:</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 20, margin: 0 }}>
              <li><strong>Family savings</strong> — the most common route. Many families treat CPL training as a long-term investment in the same category as professional education.</li>
              <li><strong>Aviation loans</strong> — Saraswat Bank has tie-ups with several approved FTOs and offers aviation-specific loans. HDFC and SBI also offer education loan products that cover pilot training at approved institutions. Collateral requirements and interest rates vary. Compare options carefully before committing.</li>
              <li><strong>FTO instalment plans</strong> — some FTOs offer structured payment plans across the training period rather than requiring the full amount upfront. This reduces the upfront capital requirement but does not reduce the total cost.</li>
              <li><strong>Working and saving first</strong> — candidates who begin in their early twenties sometimes spend 2–3 years working and building savings before enrolling. This reduces the loan requirement and gives you time to research FTOs thoroughly.</li>
            </ul>
          </Prose>

          <Callout variant="blue">
            <strong>On airline cadet programmes:</strong> Some Indian airlines run cadet programmes that sponsor training and include a type rating, with a bond period requiring you to fly with that airline for a set number of years after qualifying. IndiGo&apos;s cadet programme is the most prominent example. These programmes are competitive, have specific selection criteria, and are not always open — monitor airline websites and aviation forums for announcements of new cohorts. If you are selected for a cadet programme, the financial picture changes significantly.
          </Callout>
        </Section>

        <Section title="What happens after your CPL">
          <Prose>
            <p>A fresh Indian CPL is a licence to fly commercially — but not on commercial airliners yet. Airlines require a type rating on their specific aircraft type (A320, B737, ATR 72) and minimum flight hours above what a fresh CPL provides.</p>
            <p>The path from CPL to an airline first officer seat — the topic of the next article in this series — involves either a cadet programme, a self-funded type rating, or hours-building in general aviation or charter before airline applications. Airline first officers at major Indian carriers earn approximately ₹1.5–2.5 lakhs per month at entry level, rising substantially with seniority and command upgrade.</p>
            <p>The airline hiring article covers this in full. The point here is simply that the CPL is the beginning of the career, not the end of the journey — and knowing that helps you plan realistically for what comes after the licence.</p>
          </Prose>
        </Section>

        <CtaBlock
          title="Start preparing for your DGCA theory exams today"
          body="ProPilotLicence gives you 7,000+ practice questions across all five CPL subjects — organised by book and chapter, verified by active airline captains. Free to start, no credit card required."
          href="/subjects"
          label="Start practising free →"
        />

        <Section title="Quick reference — the complete CPL checklist">
          <DataTable
            head={['Milestone', 'What you need', 'Timeline']}
            rows={[
              ['Eligibility confirmed', '10+2 PCM certificate; Indian citizenship or OCI', 'Week 1'],
              ['Class 2 medical', 'DGCA-approved examiner; basic health checks', 'Week 1–2'],
              ['Class 1 medical', 'AFCME / IAM; PMR number from Class 2', '6–10 weeks'],
              ['DGCA Computer Number', 'eGCA registration at egca.gov.in', 'With Class 2 medical'],
              ['FTO selected and enrolled', 'DGCA-approved FTO; in-person visit recommended', 'Month 2–4'],
              ['Student Pilot Licence', 'Computer Number + Class 2 medical; eGCA application', 'Month 2–4'],
              ['Theory exams passed', '5 subjects + RTR(A); 70% pass each; via Pariksha portal', 'Month 6–24'],
              ['200 flight hours complete', 'DGCA-approved FTO; solo, x-country, instrument, night', 'Month 18–36'],
              ['CPL skills test', 'All theory passed; Class 1 medical current; DGCA examiner', 'Month 24–36'],
              ['CPL issued', 'eGCA application post skills test', '2–4 weeks after test'],
            ]}
          />
        </Section>

        <Disclaimer>
          Costs, timelines, and regulatory requirements are approximate and current as of mid-2026. DGCA requirements are subject to change — always verify current requirements directly with DGCA via the eGCA portal or official DGCA communications before making financial commitments. Medical standards vary by individual medical history — consult a DGCA-approved aviation medical examiner for an assessment specific to your situation. Training costs vary significantly by FTO, location, aircraft type, and individual progress. Content reviewed by the ProPilotLicence Captain Panel — active commercial airline captains holding current DGCA CPL and ATPL licences. This article does not constitute financial or career advice.
        </Disclaimer>
      </main>

      <SiteFooter />
    </div>
  )
}
