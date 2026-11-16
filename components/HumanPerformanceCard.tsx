import Link from 'next/link'

// Human Performance is a chapter of Air Regulations (in RK Bali), not a subject of its
// own, so students searching for "human factors" don't find it in the subject list. This
// card points them to its chapter practice: logged-out visitors go through login and come
// back (proxy.ts). Shown on /subjects and near the top of the Air Regulations page.
//
// The chapter is identified by its record, not its number: the number (for the practice
// link and the page text) is read from the database, so renumbering the book's chapters
// needs no code change. If that lookup fails, the card links to the book page instead.
export const HUMAN_PERFORMANCE = { bookSlug: 'rk-bali-air-regulations', chapterId: '6f00dd46-63a4-4027-884d-148b2bb8575f' } as const
const TITLE = 'Human Performance and Limitations (Human Factors)'

export default function HumanPerformanceCard({ chapter, variant }: {
  chapter: { number: number; questions: number } | null
  variant: 'card' | 'highlight'
}) {
  const href = chapter ? `/practice/chapter/${HUMAN_PERFORMANCE.bookSlug}/${chapter.number}` : `/books/${HUMAN_PERFORMANCE.bookSlug}`
  const where = chapter ? `Part of Air Regulations · RK Bali chapter ${chapter.number}` : 'Part of Air Regulations · RK Bali'

  if (variant === 'card') {
    return (
      <Link
        href={href}
        data-cta="hp-card"
        style={{ display: 'block', textDecoration: 'none', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 12, padding: '20px 24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 4 }}>
              {TITLE}
            </div>
            <div style={{ fontSize: 13, color: 'var(--clr-text-med)' }}>{where}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--clr-primary)', fontFamily: 'var(--font-outfit),sans-serif' }}>
              {chapter ? chapter.questions.toLocaleString() : '—'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--clr-text-med)', marginTop: 1 }}>practice questions</div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      data-cta="hp-card"
      style={{ display: 'block', textDecoration: 'none', background: 'var(--clr-pri-light)', border: '1.5px solid var(--clr-primary)', borderRadius: 12, padding: '14px 18px', marginBottom: 32 }}
    >
      <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 2 }}>
        {TITLE}
      </div>
      <div style={{ fontSize: 13, color: 'var(--clr-text-med)', lineHeight: 1.5 }}>
        {where}
        {chapter && ` · ${chapter.questions.toLocaleString()} practice questions`}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--clr-primary)', marginTop: 8 }}>
        Practise Human Performance →
      </div>
    </Link>
  )
}
