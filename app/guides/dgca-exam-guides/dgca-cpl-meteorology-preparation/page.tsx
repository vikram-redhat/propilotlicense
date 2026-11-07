import Link from 'next/link'
import LandingHeader from '@/components/LandingHeader'
import { getHeaderAuthState } from '@/lib/supabase-server'
import SiteFooter from '@/components/SiteFooter'
import { ArticleSchema } from '@/components/schema/ArticleSchema'
import { FAQSchema } from '@/components/schema/FAQSchema'
import { buildMetadata } from '@/lib/metadata'
import { unstable_cache } from 'next/cache'
import { getBookBySlug } from '@/lib/books'
import { chapterPageHref } from '@/lib/chapter-pages'
import { countChapterQuestions } from '@/lib/chapter-question-counts'
import { bookQuestionTotalOrNull } from '@/lib/live-counts'
import { createServiceClient } from '@/lib/supabase'

export const metadata = buildMetadata({
  title: 'How to Prepare for the DGCA CPL Meteorology Exam — Complete Study Guide | ProPilotLicence',
  description:
    'A complete guide to preparing for the DGCA CPL Aviation Meteorology paper. Which book to use, which chapters matter most, how to approach Indian climatology, and what to expect on exam day.',
  path: '/guides/dgca-exam-guides/dgca-cpl-meteorology-preparation',
})

const BOOK_SLUG = 'ic-joshi-aviation-meteorology'
// Article dateModified; the visible "Updated" line is generated from it.
const DATE_MODIFIED = '2026-11-08'

type SyllabusChapter = {
  number: number
  name: string
  weight: 'High' | 'Medium' | 'Low' | null
  topics: string | null
  questions: number
  href: string | null
}

// The chapter table and every tier list on this page come from the IC Joshi 2019
// chapters (the syllabus map) and the Captain Panel's exam_weight, so they can't drift
// from the book page and chapter pages. Question counts use the practice picker's rule.
// Cached for an hour like the book page (this page reads auth cookies, so page-level
// revalidate alone wouldn't cache it). Throws on a database error.
const loadSyllabus = unstable_cache(async (): Promise<SyllabusChapter[]> => {
  const entry = getBookBySlug(BOOK_SLUG)
  if (!entry || !('sourceBookId' in entry)) throw new Error('IC Joshi book entry missing')
  const supabase = createServiceClient()
  const [bookRes, chaptersRes] = await Promise.all([
    supabase.from('source_books').select('id, subject_id').eq('id', entry.sourceBookId).single(),
    supabase.from('chapters').select('id, chapter_number, chapter_name, exam_weight, syllabus_topics')
      .eq('book_id', entry.sourceBookId).order('chapter_number'),
  ])
  if (bookRes.error) throw new Error(`Meteorology guide: ${bookRes.error.message}`)
  if (chaptersRes.error) throw new Error(`Meteorology guide: ${chaptersRes.error.message}`)
  const counts = await countChapterQuestions(supabase, {
    subjectId: bookRes.data.subject_id, bookId: bookRes.data.id,
    chapterIds: chaptersRes.data.map(c => c.id), country: 'IN',
  })
  return chaptersRes.data.map(c => ({
    number: c.chapter_number,
    name: c.chapter_name,
    weight: c.exam_weight ?? null,
    topics: c.syllabus_topics ?? null,
    questions: counts[c.id] ?? 0,
    href: chapterPageHref(BOOK_SLUG, c.chapter_number),
  }))
}, ['met-guide-syllabus'], { revalidate: 3600 })

// "1 to 7, 13 and 21": runs of three or more collapse to "a to b".
function chapterList(numbers: number[]): string {
  const parts: string[] = []
  for (let i = 0; i < numbers.length;) {
    let j = i
    while (j + 1 < numbers.length && numbers[j + 1] === numbers[j] + 1) j++
    if (j - i >= 2) parts.push(`${numbers[i]} to ${numbers[j]}`)
    else for (let k = i; k <= j; k++) parts.push(String(numbers[k]))
    i = j + 1
  }
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0] ?? ''
}

// "10 (Optical Phenomenon), 17 (Mountain Waves) and 22 (…)"
function namedChapterList(chapters: SyllabusChapter[]): string {
  const parts = chapters.map(c => `${c.number} (${c.name})`)
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0] ?? ''
}

// One table line: cut at the last "; " before the limit.
function oneLine(topics: string, max = 90): string {
  if (topics.length <= max) return topics
  const cut = topics.lastIndexOf('; ', max)
  return `${topics.slice(0, cut > 0 ? cut : max).trim()} …`
}

// Editorial notes from the Captain Panel, by IC Joshi 2019 chapter number. The page
// shows each under the tier the chapter's exam_weight puts it in.
const chapterNotes = (weightOf: Map<number, SyllabusChapter['weight']>): { number: number; title: string; body: React.ReactNode }[] => [
  {
    number: 13,
    title: 'Thunderstorm',
    body: <>
      This is the single most heavily tested topic in the DGCA Meteorology paper. Expect four to six questions per paper on thunderstorm formation, types, stages of development, and associated hazards — icing, turbulence, windshear, lightning, hail, and microburst activity. The DGCA tests this topic in depth because the consequences of thunderstorm encounters are severe and the decisions pilots make around convective activity are operationally critical.
      <br /><br />
      Know the three stages of thunderstorm development (cumulus, mature, dissipating) and what characterises each. Know the difference between single-cell, multicell, and supercell thunderstorms. Know the specific hazards associated with each stage and how altitude affects them. This is not a chapter to skim.
    </>,
  },
  {
    number: 19,
    title: 'Climatology India',
    body: <>
      This chapter is rated {weightOf.get(19) ?? 'Medium'} overall, but it is where the DGCA paper diverges most sharply from international syllabi. Candidates who studied from Oxford or Jeppesen alone walk in well-prepared for general meteorology and underprepared for the three to five questions on Indian weather systems.
      <br /><br />
      What the DGCA tests from Chapter 19: the southwest monsoon mechanism (onset, progression, withdrawal), the northeast monsoon, western disturbances and their seasonal timing, the role of the Himalayas in Indian weather patterns, the ITCZ position over the subcontinent through the year, and seasonal visibility and fog patterns over northern India. These are not obscure topics — they are predictable fixtures of the paper.
    </>,
  },
  {
    number: 14,
    title: 'Air Masses and Western Disturbances',
    body: <>
      Frontal weather sequences are tested reliably — what weather to expect before a warm front, what changes at the front passage, what follows behind a cold front. The DGCA tests these sequences in both directions: given weather conditions, identify the frontal type; given a frontal type, describe the expected weather sequence. Know both.
      <br /><br />
      Occlusions — warm and cold — are also tested and are a common source of confusion. The distinction between a warm occlusion and a cold occlusion, and the weather associated with each, is specific enough that candidates who have not studied it precisely will guess.
    </>,
  },
  {
    number: 6,
    title: 'Winds',
    body: <>
      {'Geostrophic wind, gradient wind, surface friction effects, and jet streams are all tested. Jet stream characteristics — altitude, seasonal variation, location — appear consistently. Wind shear definitions and their operational implications are tested specifically.'}
    </>,
  },
  {
    number: 12,
    title: 'Ice Accretion',
    body: <>
      {'Rime, clear, and mixed icing — conditions for each type\'s formation. The effect of icing on lift, drag, stall speed, and instrument readings. Freezing rain is tested specifically for its icing severity (clear ice, most dangerous). Anti-icing vs de-icing distinction.'}
    </>,
  },
  {
    number: 2,
    title: 'Atmospheric Pressure',
    body: <>
      {'Altimeter settings — QNH, QFE, QNE — and the conditions under which each is used. Pressure altitude and density altitude. The DGCA tests altimeter setting questions in both Meteorology and Navigation.'}
    </>,
  },
]

const FAQS = [
  {
    q: 'How difficult is the DGCA CPL Meteorology paper compared to other CPL subjects?',
    a: 'Meteorology is generally considered one of the more manageable CPL papers by candidates who have studied the text book thoroughly. The most common failure pattern is not insufficient study effort — it is misaligned study material. Candidates who used international textbooks as their primary reference consistently underperform on Indian climatology questions. With the text book and chapter-wise practice, the paper is very passable.',
  },
  {
    q: 'How many questions on the DGCA Meteorology paper are about Indian weather specifically?',
    a: 'Based on the ProPilotLicence captain panel\'s assessment: three to five questions per paper typically draw specifically from Indian climatology content — monsoon systems, western disturbances, ITCZ position, and seasonal fog. In a 50-question paper with a 70% pass threshold, dropping all five of those questions costs you 10% of your score before you have answered anything else. They are preventable losses.',
  },
  {
    q: 'Do I need to study DGCA AIP India for the Meteorology paper?',
    a: 'The DGCA AIP India is worth reviewing specifically for current METAR and TAF format conventions, which can differ slightly from what is in older editions of IC Joshi. The AIP is available free on the AAI website. Focus on the GEN and MET sections. You do not need to read the AIP comprehensively for the Meteorology paper.',
  },
  {
    q: 'Is one month sufficient to prepare for the DGCA Meteorology paper?',
    a: 'For a candidate who is actively studying (two to three hours per day), one month is sufficient to complete IC Joshi chapter by chapter with question practice and still have time for mock exams in the final week. The risk with a compressed timeline is rushing through Chapter 19 — do not. Indian Climatology takes time to absorb if you have no prior exposure to Indian weather systems.',
  },
  {
    q: 'Can I pass the DGCA Meteorology paper using only ProPilotLicence without reading IC Joshi?',
    a: 'No, and we would not recommend trying. ProPilotLicence is designed to work alongside IC Joshi, not replace it. The questions test understanding of concepts explained in the book — attempting questions without having read the source material produces lower scores and, more importantly, does not build the knowledge you need for the actual exam. Read the chapter, then practise the questions.',
  },
]

export default async function MeteorologyPrepPost() {
  const [{ isLoggedIn, name }, loaded, bankTotal] = await Promise.all([
    getHeaderAuthState(),
    // A failed hourly refresh serves the last good data (unstable_cache). Only with no
    // cached data at all and the database down does this fall back, and the page renders
    // without the table and tier lists rather than erroring.
    loadSyllabus().catch(e => { console.error(e); return null }),
    bookQuestionTotalOrNull(BOOK_SLUG), // the book page's count
  ])
  const syllabus = loaded ?? []
  const tier = (w: SyllabusChapter['weight']) => syllabus.filter(c => c.weight === w)
  const high = tier('High'), medium = tier('Medium'), low = tier('Low'), unrated = tier(null)
  const highList = chapterList(high.map(c => c.number))
  const weightOf = new Map(syllabus.map(c => [c.number, c.weight]))
  // Editorial notes for some chapters, shown under whichever tier the panel's weight puts
  // the chapter in (in this order within a tier).
  const notesIn = (w: SyllabusChapter['weight']) => chapterNotes(weightOf).filter(n => weightOf.get(n.number) === w)
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <ArticleSchema
        title="How to Prepare for the DGCA CPL Meteorology Exam — Complete Study Guide"
        description="A complete guide to preparing for the DGCA CPL Aviation Meteorology paper. Which book to use, which chapters matter most, how to approach Indian climatology, and what to expect on exam day."
        url="https://www.propilotlicence.com/guides/dgca-exam-guides/dgca-cpl-meteorology-preparation"
        publishedAt="2026-06-15"
        updatedAt={DATE_MODIFIED}
      />
      <FAQSchema faqs={FAQS} />
      <LandingHeader isLoggedIn={isLoggedIn} name={name} />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 96px' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: 'var(--clr-text-med)', marginBottom: 24 }}>
          <Link href="/guides/dgca-exam-guides" style={{ color: 'var(--clr-text-med)', textDecoration: 'none' }}>DGCA Exam Guides</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>DGCA CPL Meteorology Preparation</span>
        </nav>

        <div style={{ fontSize: 12, color: 'var(--clr-text-med)', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span>Reviewed by ProPilotLicence Captain Panel</span>
          <span>·</span>
          <span>Updated {new Date(DATE_MODIFIED).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 30, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 32 }}>
          How to Prepare for the DGCA CPL Meteorology Exam
        </h1>

        <Prose>
          <p>
            The DGCA CPL Aviation Meteorology paper is 50 questions in 90 minutes, and a 70% pass mark is required. On paper, it is one of the more manageable CPL subjects. In practice, it catches a specific type of candidate: the one who studied from an international textbook, felt well-prepared, and then encountered three to five questions about Indian monsoon systems and subcontinent weather that their book simply did not cover in that detail as expected in the DGCA paper.
          </p>
          <p>
            This guide covers what to study, how to study it, which chapters matter most, and where candidates typically lose marks they should not lose.
          </p>
        </Prose>

        <Divider />

        <Section title="The one book you need">
          <Prose>
            <p>
              <strong>Aviation Meteorology by Group Captain IC Joshi (IAF, Retd.)</strong> is the primary DGCA-prescribed textbook for the CPL Meteorology paper and frankly the only study material you strictly need for it. If you are currently using an Oxford, Jeppesen, or other international text as your primary Meteorology reference, you are underprepared for the Indian-specific content the DGCA tests.
            </p>
            <p>
              This is not a criticism of international texts — they are thorough and technically rigorous. They are written for European and North American syllabi. The DGCA CPL Meteorology paper requires you to study intensively Indian climatology. The Indian monsoon, western disturbances, the ITCZ over the subcontinent, and seasonal weather patterns over Indian airspace receive significant weight in the DGCA paper and negligible coverage in international textbooks.
            </p>
            <p>Buy IC Joshi. Study IC Joshi. Use international texts as supplementary reading if you want additional depth on specific topics, but Joshi should be the primary reference.</p>
          </Prose>
          <InternalLink href="/books/ic-joshi-aviation-meteorology">
            See the chapter-by-chapter breakdown of IC Joshi on ProPilotLicence →
          </InternalLink>
        </Section>

        <Divider />

        <Section title="How to structure your study">
          <Prose>
            <p>
              The most effective approach is chapter-by-chapter with immediate question practice after each chapter — not reading the whole book first and practising questions later.
            </p>
            <p>
              <strong>Why this order matters:</strong> When you answer a question incorrectly after reading a chapter, the chapter content is still fresh enough to go back and correct your understanding immediately. When you read the whole book first and practise questions three weeks later, wrong answers are harder to trace back to their source, and the correction does not stick as well.
            </p>
            <p>The practical sequence:</p>
          </Prose>
          <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 15, lineHeight: 1.7, color: 'var(--clr-text)' }}>
            <li>Read one chapter of the text book by IC Joshi</li>
            <li>Immediately practise all questions from that chapter on ProPilotLicence</li>
            <li>For every question answered incorrectly, note the topic and re-read the relevant section of the chapter</li>
            <li>Move to the next chapter only when you are consistently getting above 70% on that chapter&apos;s questions</li>
            <li>After completing all chapters, run full-subject mock exams</li>
          </ol>
          <Prose>
            <p>
              Do not run mock exams until you have completed all 26 chapters. Mock exams measure readiness — they do not build it. Running mocks on incomplete syllabus coverage produces demoralising scores that misrepresent your actual potential.
            </p>
          </Prose>
        </Section>

        <Divider />

        <Section title="Chapter priority: where the marks are">
          <Prose>
            <p>
              Not all 26 chapters of IC Joshi carry equal weight in the DGCA paper. Based on review by the ProPilotLicence captain panel, here is an honest assessment of where to spend your time.
            </p>
          </Prose>

          {loaded ? <>
          <ChapterTable chapters={syllabus} />

          <PriorityLabel colour="var(--clr-correct)" bg="var(--clr-correct-bg)">Highest priority — study these first and revisit before the exam</PriorityLabel>
          <Prose><p>The Captain Panel rates Chapters {highList} High.</p></Prose>
          {notesIn('High').map(n => <ChapterEntry key={n.number} number={n.number} title={n.title}>{n.body}</ChapterEntry>)}

          <PriorityLabel colour="var(--clr-amber)" bg="var(--clr-amber-light)">Medium priority — study thoroughly</PriorityLabel>
          <Prose><p>Rated Medium: Chapters {chapterList(medium.map(c => c.number))}.</p></Prose>
          {notesIn('Medium').map(n => <ChapterEntry key={n.number} number={n.number} title={n.title}>{n.body}</ChapterEntry>)}

          <PriorityLabel colour="var(--clr-text-med)" bg="var(--clr-surf-alt)">Lower priority — understand the concepts, do not over-invest</PriorityLabel>
          <Prose>
            <p>
              Chapters {namedChapterList(low)} produce questions but at lower frequency than the chapters above. Study them in sequence — do not skip them — but do not spend disproportionate time on them at the expense of Chapters {highList}.
            </p>
            {unrated.length > 0 && <p>Not yet rated: Chapters {namedChapterList(unrated)}.</p>}
          </Prose>
          </> : (
            <InternalLink href={`/books/${BOOK_SLUG}`}>See the chapter-by-chapter breakdown of IC Joshi, with the panel&apos;s exam weights →</InternalLink>
          )}
        </Section>

        <Divider />

        <Section title="The Indian climatology problem in detail">
          <Prose>
            <p>
              Climatology India is rated {weightOf.get(19) ?? 'Medium'}, but its questions are the ones international textbooks leave you unprepared for, which makes them the easiest marks to lose.
            </p>
            <p>
              It is worth being specific about this because it is the most predictable failure point for candidates who are otherwise well-prepared.
            </p>
            <p>
              The southwest monsoon accounts for roughly 70–80% of India&apos;s annual rainfall and directly affects flight operations across the entire subcontinent for four months of the year. The DGCA tests it because it is operationally significant for Indian commercial aviation in a way that has no parallel in European or North American operations. No international textbook covers it adequately because no international syllabus requires it.
            </p>
            <p><strong>What to know specifically:</strong></p>
            <p>
              The southwest monsoon onset begins over Kerala in late May to early June and progresses northward, reaching Delhi and northern India by late June to early July. Withdrawal follows the reverse path. The monsoon is driven by the differential heating of the Indian landmass relative to the Indian Ocean, drawing moist southwesterly airflow northward as the ITCZ migrates toward the subcontinent.
            </p>
            <p>
              The northeast monsoon is the winter counterpart, affecting primarily southeastern India and Sri Lanka between October and December. It is weaker and more localised than the southwest monsoon.
            </p>
            <p>
              Western disturbances are extratropical cyclones that originate over the Mediterranean and travel eastward across Iran, Afghanistan, and Pakistan into northwestern India, primarily between November and March. They bring rainfall and snowfall to northern India and the Himalayas during winter. The DGCA tests their origin, seasonal timing, and associated weather.
            </p>
            <p>
              The Himalayas act as a meteorological barrier — blocking cold continental air from the north in winter and trapping monsoonal moisture on the southern slopes in summer. This barrier effect is directly relevant to orographic precipitation and mountain wave formation questions.
            </p>
            <p>
              Dense fog over the Indo-Gangetic Plain — stretching from Punjab through Delhi and UP to Bihar — is a significant operational hazard during the winter months (December to February). The DGCA tests its causes (radiation fog under light wind and clear sky conditions after monsoon withdrawal), its seasonal timing, and its effect on operations at major northern Indian airports.
            </p>
            <p>If you can answer questions on all of the above with precision, you are well-prepared for Chapter 19.</p>
          </Prose>
        </Section>

        <Divider />

        <Section title="What to do in the final week before the exam">
          <Prose>
            <p>
              By the final week, you should have completed all chapters and have mock exam scores consistently above 75%. The final week is not for new learning — it is for reinforcement and weak-chapter targeting.
            </p>
          </Prose>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['Days 7–4 before the exam', 'Run one full-subject mock exam per day. After each mock, identify every question answered incorrectly and return to the source chapter. Do not simply read the correct answer — read the section of the text book that covers the concept, so you understand why the correct answer is correct rather than memorising the answer to that specific question.'],
              ['Days 3–2 before the exam', 'Stop full mock exams. Switch to chapter-specific sessions on your weakest chapters only — the ones where your mock performance was lowest. Use the ProPilotLicence chapter filter to drill exclusively those chapters.'],
              ['Day 1 before the exam', `Light revision only. Skim your notes on the High-weight chapters${highList ? ` (${highList})` : ''}, concentrating on the ones where your mock scores were weakest. Do not attempt new questions. Get eight hours of sleep.`],
            ].map(([label, text]) => (
              <div key={label} style={{ padding: '14px 16px', background: 'var(--clr-surf-alt)', border: '1px solid var(--clr-border)', borderRadius: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--clr-primary)', marginBottom: 6 }}>{label}</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--clr-text)', margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        <Section title="On the day">
          <Prose>
            <p>
              The Meteorology paper is 50 questions in 90 minutes — 1 minute 48 seconds per question. You will not be rushed. Read each question fully before looking at the options. Many wrong answers are chosen because candidates read half a question and selected an option that would be correct for the question they thought they were answering.
            </p>
            <p>
              For METAR decoding questions specifically: decode the string systematically from left to right, group by group, before looking at the options. Candidates who try to match the METAR to options simultaneously make decoding errors they would not otherwise make.
            </p>
            <p>
              If you are genuinely uncertain about a question, mark it and move on. Return to it at the end. Spending four minutes on one uncertain question at the expense of three straightforward questions you would have answered correctly is a poor trade.
            </p>
          </Prose>
        </Section>

        <Divider />

        {/* FAQs */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 20 }}>
            Frequently asked questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{ padding: '20px 0', borderBottom: i < FAQS.length - 1 ? '1px solid var(--clr-border)' : 'none' }}
              >
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--clr-text)', marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--clr-text-med)' }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* Internal links CTA */}
        <div style={{ background: 'var(--clr-pri-light)', border: '1px solid var(--clr-border)', borderRadius: 12, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--clr-text)' }}>
            Practise DGCA Meteorology questions
          </div>
          <p style={{ fontSize: 14, color: 'var(--clr-text-med)', lineHeight: 1.65, margin: 0 }}>
            {bankTotal != null ? `${bankTotal.toLocaleString()} questions` : 'Questions'} from IC Joshi and related books, organised mostly by chapter. First 10 free, no sign-up required.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/subjects/aviation-meteorology" style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>Aviation Meteorology subject page →</Link>
            <Link href="/books/ic-joshi-aviation-meteorology" style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>IC Joshi chapter breakdown →</Link>
            <Link href="/pricing" style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>Pricing →</Link>
            <Link href="/guides/dgca-exam-guides/dgca-cpl-books" style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>Which books to study →</Link>
          </div>
        </div>
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
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.3px' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--clr-text)', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {children}
    </div>
  )
}

function InternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ display: 'inline-block', fontSize: 14, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>
      {children}
    </Link>
  )
}

function PriorityLabel({ colour, bg, children }: { colour: string; bg: string; children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: colour, background: bg, borderRadius: 6, padding: '5px 10px', display: 'inline-block', marginBottom: 4 }}>
      {children}
    </div>
  )
}

function ChapterEntry({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--clr-border)' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--clr-primary)', background: 'var(--clr-pri-light)', borderRadius: 5, padding: '2px 7px', flexShrink: 0, marginTop: 2 }}>
          Ch {number}
        </div>
        <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--clr-text)' }}>{title}</div>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--clr-text-med)', paddingLeft: 44 }}>{children}</div>
    </div>
  )
}

// All 26 IC Joshi 2019 chapters with the panel's weight, syllabus topics and live
// question counts. Scrolls sideways on a phone rather than squashing.
function ChapterTable({ chapters }: { chapters: SyllabusChapter[] }) {
  const th: React.CSSProperties = { textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--clr-text-med)', padding: '10px 12px', background: 'var(--clr-surf-alt)', borderBottom: '1px solid var(--clr-border)', whiteSpace: 'nowrap' }
  const td: React.CSSProperties = { padding: '10px 12px', borderBottom: '1px solid var(--clr-border)', verticalAlign: 'top', fontSize: 14, lineHeight: 1.5, color: 'var(--clr-text)' }
  return (
    <div>
      <div style={{ overflowX: 'auto', border: '1px solid var(--clr-border)', borderRadius: 10 }}>
        <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Chapter</th>
              <th style={th}>Exam weight</th>
              <th style={th}>What DGCA asks</th>
              <th style={{ ...th, textAlign: 'right' }}>Questions</th>
            </tr>
          </thead>
          <tbody>
            {chapters.map(c => (
              <tr key={c.number}>
                <td style={{ ...td, fontWeight: 600, minWidth: 170 }}>
                  {c.number}.{' '}
                  {c.href
                    ? <Link href={c.href} style={{ color: 'var(--clr-primary)', textDecoration: 'underline', textUnderlineOffset: 2 }}>{c.name}</Link>
                    : c.name}
                </td>
                <td style={{ ...td, whiteSpace: 'nowrap', fontWeight: c.weight === 'High' ? 700 : 400, color: c.weight === 'High' ? 'var(--clr-wrong)' : c.weight ? 'var(--clr-text)' : 'var(--clr-text-med)' }}>
                  {c.weight ?? 'Not yet rated'}
                </td>
                <td style={{ ...td, color: 'var(--clr-text-med)' }} title={c.topics ?? undefined}>{c.topics ? oneLine(c.topics) : '—'}</td>
                <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.questions.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 13, color: 'var(--clr-text-med)', fontStyle: 'italic', marginTop: 8 }}>
        Exam weight is the ProPilotLicence Captain Panel&apos;s judgement of how heavily DGCA tests each chapter.
      </p>
    </div>
  )
}
