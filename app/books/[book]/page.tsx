import { notFound } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { CourseSchema } from '@/components/schema/CourseSchema'
import { FAQSchema } from '@/components/schema/FAQSchema'
import { buildMetadata } from '@/lib/metadata'
import { BOOKS, getBookBySlug } from '@/lib/books'

export function generateStaticParams() {
  return BOOKS.map((b) => ({ book: b.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params
  const book = getBookBySlug(slug)
  if (!book) return {}
  return buildMetadata({
    title: `${book.title} by ${book.authorShort} — DGCA ${book.subjectTitle} Questions | ProPilotLicence`,
    description: `${book.questionCount.toLocaleString()} practice questions sourced from ${book.title} by ${book.author}. Organised by chapter. Reviewed by active airline captains.`,
    path: `/books/${slug}`,
  })
}

export default async function BookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params
  const book = getBookBySlug(slug)
  if (!book) notFound()

  const url = `https://propilotlicence.com/books/${book.slug}`
  const courseDescription = `${book.questionCount.toLocaleString()} practice questions sourced from ${book.title} by ${book.author}, organised by chapter and reviewed by active airline captains.`

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <CourseSchema name={`${book.title} — DGCA ${book.subjectTitle}`} description={courseDescription} url={url} />
      <FAQSchema faqs={[...book.faqs]} />
      <SiteHeader right={<Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-primary)', textDecoration: 'none', padding: '5px 4px' }}>Log in</Link>} />

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px 96px' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: 'var(--clr-text-med)', marginBottom: 24 }}>
          <Link href="/subjects" style={{ color: 'var(--clr-text-med)', textDecoration: 'none' }}>Subjects</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href={`/subjects/${book.subjectSlug}`} style={{ color: 'var(--clr-text-med)', textDecoration: 'none' }}>{book.subjectTitle}</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>{book.authorShort}</span>
        </nav>

        <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--clr-primary)', background: 'var(--clr-pri-light)', border: '1px solid var(--clr-border)', borderRadius: 4, padding: '2px 8px', marginBottom: 12, textTransform: 'uppercase' }}>
          DGCA prescribed textbook
        </div>

        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 8 }}>
          {book.title}
        </h1>
        <div style={{ fontSize: 15, color: 'var(--clr-text-med)', marginBottom: 4 }}>{book.author}</div>
        <div style={{ fontSize: 13, color: 'var(--clr-text-med)', marginBottom: 28 }}>{book.publisher}</div>

        <p style={{ fontSize: 16, color: 'var(--clr-text)', lineHeight: 1.7, marginBottom: 36 }}>
          {book.description}
        </p>

        {/* Stats strip */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
          {[
            { label: 'Practice questions', value: book.questionCount.toLocaleString() },
            { label: 'Chapters covered', value: `${book.chapterBreakdown.length}` },
            { label: 'Subject', value: book.subjectTitle },
            { label: 'DGCA prescribed', value: book.dgcaPrescribed ? 'Yes' : 'No' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'var(--clr-surf-alt)', border: '1px solid var(--clr-border)', borderRadius: 8, padding: '10px 16px', minWidth: 100 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--clr-primary)', fontFamily: 'var(--font-outfit),sans-serif' }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--clr-text-med)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Chapter breakdown */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 20 }}>
            Chapter-by-chapter breakdown
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--clr-border)', borderRadius: 10, overflow: 'hidden' }}>
            {book.chapterBreakdown.map((ch, i) => (
              <div
                key={ch.number}
                style={{
                  padding: '16px 20px',
                  borderBottom: i < book.chapterBreakdown.length - 1 ? '1px solid var(--clr-border)' : 'none',
                  background: 'var(--clr-surface)',
                }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--clr-primary)', background: 'var(--clr-pri-light)', borderRadius: 6, padding: '2px 7px', flexShrink: 0, marginTop: 2 }}>
                    Ch {ch.number}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--clr-text)', marginBottom: 4 }}>{ch.title}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--clr-text-med)' }}>{ch.notes}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sample question */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 16 }}>
            Sample question
          </h2>
          <div style={{ background: 'var(--clr-surf-alt)', border: '1px solid var(--clr-border)', borderRadius: 12, padding: '20px 20px 16px', fontSize: 13, color: 'var(--clr-text-med)', marginBottom: 4 }}>
            From Chapter {book.sampleQuestion.sourceChapter}: {book.sampleQuestion.sourceChapterTitle}
          </div>
          <div style={{ border: '1px solid var(--clr-border)', borderRadius: 12, padding: '24px', background: 'var(--clr-surface)' }}>
            <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--clr-text)', lineHeight: 1.6, marginBottom: 16 }}>
              {book.sampleQuestion.text}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {book.sampleQuestion.options.map((opt, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontSize: 14,
                    lineHeight: 1.5,
                    background: i === book.sampleQuestion.correctIndex ? 'var(--clr-correct-bg)' : 'var(--clr-surf-alt)',
                    color: i === book.sampleQuestion.correctIndex ? 'var(--clr-correct)' : 'var(--clr-text)',
                    fontWeight: i === book.sampleQuestion.correctIndex ? 600 : 400,
                    border: `1px solid ${i === book.sampleQuestion.correctIndex ? 'var(--clr-correct)' : 'var(--clr-border)'}`,
                  }}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--clr-pri-light)', border: '1px solid var(--clr-border)', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--clr-primary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Explanation</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--clr-text)', margin: 0 }}>{book.sampleQuestion.explanation}</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div style={{ background: 'var(--clr-hero)', borderRadius: 14, padding: '28px 24px', marginBottom: 48, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Practise all {book.questionCount.toLocaleString()} questions from {book.authorShort}
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', marginBottom: 20 }}>
            Organised by chapter. Reviewed by active airline captains. First 10 questions free.
          </p>
          <Link
            href="/login"
            style={{ display: 'inline-block', background: 'var(--clr-amber)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontFamily: 'var(--font-outfit),sans-serif' }}
          >
            Start practising free
          </Link>
        </div>

        {/* FAQs */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 20 }}>
            Frequently asked questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {book.faqs.map((faq, i) => (
              <div
                key={i}
                style={{ padding: '20px 0', borderBottom: i < book.faqs.length - 1 ? '1px solid var(--clr-border)' : 'none' }}
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
