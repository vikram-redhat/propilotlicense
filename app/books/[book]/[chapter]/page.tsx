import { notFound } from 'next/navigation'
import Link from 'next/link'
import LandingHeader from '@/components/LandingHeader'
import SiteFooter from '@/components/SiteFooter'
import { ArticleSchema } from '@/components/schema/ArticleSchema'
import { FAQSchema } from '@/components/schema/FAQSchema'
import { buildMetadata } from '@/lib/metadata'
import { getBookBySlug } from '@/lib/books'
import { allChapterPages, faqsFromHtml, getChapterPage, resolveChapterLinks } from '@/lib/chapter-pages'
import { countChapterQuestions } from '@/lib/chapter-question-counts'
import { createServiceClient } from '@/lib/supabase'
import styles from './styles.module.css'

// Live panel values and sample questions come from Supabase; re-fetch hourly. A DB error
// throws, so a revalidation failure keeps serving the last good page.
export const revalidate = 3600
export const dynamicParams = false // only chapters with an editorial content file exist

const SITE = 'https://www.propilotlicence.com'

export function generateStaticParams() {
  return allChapterPages().map(({ bookSlug, page }) => ({ book: bookSlug, chapter: page.slug }))
}

type Params = { params: Promise<{ book: string; chapter: string }> }

export async function generateMetadata({ params }: Params) {
  const { book: bookSlug, chapter: chapterSlug } = await params
  const page = getChapterPage(bookSlug, chapterSlug)
  if (!page) return {}
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/books/${bookSlug}/${page.slug}`,
  })
}

type SampleQuestion = {
  id: string
  question_text: string
  explanation: string | null
  source_chapter: string | null
  source_page: string | null
  citation_verified: boolean
  options: { option_letter: string; option_text: string; is_correct: boolean }[]
  source_book: { title: string; author: string | null } | null
  chapter: { chapter_number: number; chapter_name: string } | null
}

async function loadChapterData(sourceBookId: string, chapterNumber: number, sampleIds: string[]) {
  const supabase = createServiceClient()
  const [bookRes, chapterRes, totalRes, samplesRes] = await Promise.all([
    supabase.from('source_books').select('id, subject_id, title, author, edition').eq('id', sourceBookId).single(),
    supabase.from('chapters')
      .select('id, chapter_number, chapter_name, exam_weight, syllabus_topics')
      .eq('book_id', sourceBookId).eq('chapter_number', chapterNumber).single(),
    supabase.from('chapters').select('id', { count: 'exact', head: true }).eq('book_id', sourceBookId),
    supabase.from('questions')
      .select('id, question_text, explanation, source_chapter, source_page, citation_verified, options:question_options(option_letter, option_text, is_correct), source_book:source_books(title, author), chapter:chapters!chapter_id(chapter_number, chapter_name)')
      .in('id', sampleIds)
      .eq('active', true),
  ])
  for (const r of [bookRes, chapterRes, totalRes, samplesRes]) {
    if (r.error) throw new Error(`Chapter page data: ${r.error.message}`)
  }
  const book = bookRes.data!
  const chapter = chapterRes.data!
  // Same count the practice picker shows an Indian student.
  const counts = await countChapterQuestions(supabase, {
    subjectId: book.subject_id, bookId: book.id, chapterIds: [chapter.id], country: 'IN',
  })
  const byId = new Map(((samplesRes.data ?? []) as unknown as SampleQuestion[]).map(q => [q.id, q]))
  return {
    book,
    chapter,
    totalChapters: totalRes.count ?? 0,
    questionCount: counts[chapter.id] ?? 0,
    samples: sampleIds.map(id => byId.get(id)).filter(Boolean) as SampleQuestion[],
  }
}

function citation(q: SampleQuestion) {
  if (!q.source_book) return null
  const chapterLabel = q.chapter
    ? `Chapter ${q.chapter.chapter_number} — ${q.chapter.chapter_name}`
    : q.source_chapter
  return [
    `${q.source_book.title}${q.source_book.author ? ` — ${q.source_book.author}` : ''}`,
    chapterLabel,
    q.source_page,
  ].filter(Boolean).join(' · ') + (q.citation_verified ? '' : ' (approx.)')
}

export default async function ChapterPage({ params }: Params) {
  const { book: bookSlug, chapter: chapterSlug } = await params
  const page = getChapterPage(bookSlug, chapterSlug)
  const bookEntry = getBookBySlug(bookSlug)
  if (!page || !bookEntry || !('sourceBookId' in bookEntry)) notFound()

  const { book, chapter, totalChapters, questionCount, samples } =
    await loadChapterData(bookEntry.sourceBookId, page.chapterNumber, page.sampleQuestionIds)

  const bookUrl = `${SITE}/books/${bookSlug}`
  const url = `${SITE}/books/${bookSlug}/${page.slug}`
  const bookLabel = `${bookEntry.authorShort}, ${bookEntry.title}`
  const h1 = page.head.match(/<h1>([\s\S]*?)<\/h1>/)?.[1].trim() ?? page.metaTitle
  const practiceHref = `/practice/chapter/${bookSlug}/${page.chapterNumber}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: bookLabel, item: bookUrl },
      { '@type': 'ListItem', position: 2, name: `Chapter ${chapter.chapter_number}`, item: url },
    ],
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <ArticleSchema
        title={h1}
        description={page.metaDescription}
        url={url}
        publishedAt={page.publishedAt}
        updatedAt={page.updatedAt}
        about={{
          '@type': 'Book',
          name: book.title,
          author: { '@type': 'Person', name: book.author ?? bookEntry.author },
          ...(book.edition ? { bookEdition: book.edition } : {}),
          url: bookUrl,
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <FAQSchema faqs={faqsFromHtml(page.faq)} />
      <LandingHeader isLoggedIn={false} name={null} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 0' }}>
        <nav style={{ fontSize: 13, color: 'var(--clr-text-med)' }}>
          <span>Books</span>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href={`/books/${bookSlug}`} style={{ color: 'var(--clr-text-med)', textDecoration: 'none' }}>{bookLabel}</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>Chapter {chapter.chapter_number}</span>
        </nav>
      </div>

      <main className={styles.wrap} style={{ paddingTop: 16 }}>
        <div dangerouslySetInnerHTML={{ __html: page.head }} />

        {/* At a glance — live from the database */}
        <div className="glance">
          <div className="glance-row">
            <div className="glance-stat"><div className="k">Chapter</div><div className="v">{chapter.chapter_number} of {totalChapters}</div></div>
            {chapter.exam_weight && (
              <div className="glance-stat">
                <div className="k">Exam weight</div>
                <div className={`v${chapter.exam_weight === 'High' ? ' weight-high' : ''}`}>{chapter.exam_weight}</div>
              </div>
            )}
            <div className="glance-stat"><div className="k">Practice questions</div><div className="v">{questionCount.toLocaleString()}</div></div>
            {book.edition && <div className="glance-stat"><div className="k">Edition</div><div className="v">{book.edition}</div></div>}
          </div>
          {chapter.syllabus_topics && (
            <div className="glance-topics">
              <strong>DGCA syllabus topics in this chapter</strong>
              {chapter.syllabus_topics}
            </div>
          )}
          <div className="glance-note">Exam weight is the ProPilotLicence Captain Panel&apos;s judgement of how heavily DGCA tests this chapter.</div>
        </div>

        <div dangerouslySetInnerHTML={{ __html: resolveChapterLinks(page.body, bookSlug) }} />

        {/* Practice questions — fixed samples from the bank, each with its own citation */}
        <h2>Practice questions</h2>
        <p>Three questions from the {questionCount.toLocaleString()} on this chapter. Each one cites the book it comes from.</p>
        {samples.map((q, i) => {
          const correct = q.options.find(o => o.is_correct)
          const cite = citation(q)
          return (
            <div key={q.id} className="sample-q">
              <p className="sample-q-text"><strong>{i + 1}.</strong> {q.question_text}</p>
              <ol className="sample-q-options">
                {[...q.options].sort((a, b) => a.option_letter.localeCompare(b.option_letter)).map(o => (
                  <li key={o.option_letter}><span className="letter">{o.option_letter}.</span> {o.option_text}</li>
                ))}
              </ol>
              <details className="sample-q-answer">
                <summary>Show answer</summary>
                {correct && <p className="answer"><strong>Answer: {correct.option_letter}.</strong> {correct.option_text}</p>}
                {q.explanation && <p>{q.explanation}</p>}
                {cite && <p className="cite">Source: {cite}</p>}
              </details>
            </div>
          )
        })}

        {/* FAQ — from the content file; the FAQPage schema is parsed from the same HTML */}
        <div className="faq" dangerouslySetInnerHTML={{ __html: resolveChapterLinks(page.faq, bookSlug) }} />

        <div dangerouslySetInnerHTML={{ __html: resolveChapterLinks(page.related, bookSlug) }} />

        <div className="cta-block">
          <h3>Practise Chapter {chapter.chapter_number}: {chapter.chapter_name}</h3>
          <p>{questionCount.toLocaleString()} questions on this chapter, each citing its source book. Free to start.</p>
          <Link className="cta-btn" href={practiceHref}>Practise Chapter {chapter.chapter_number} →</Link>
        </div>

        <div dangerouslySetInnerHTML={{ __html: page.disclaimer }} />
      </main>

      <SiteFooter />
    </div>
  )
}
