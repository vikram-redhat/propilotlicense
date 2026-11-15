import Link from 'next/link'

// Human Performance is a chapter of Air Regulations (RK Bali chapter 22), not a subject of
// its own, so students searching for "human factors" don't find it in the subject list.
// This card points them to its chapter practice: logged-out visitors go through login and
// come back (proxy.ts). Shown on /subjects and near the top of the Air Regulations page.
export const HUMAN_PERFORMANCE = { bookSlug: 'rk-bali-air-regulations', chapter: 22 } as const
const HREF = `/practice/chapter/${HUMAN_PERFORMANCE.bookSlug}/${HUMAN_PERFORMANCE.chapter}`
const TITLE = 'Human Performance and Limitations (Human Factors)'

export default function HumanPerformanceCard({ count, variant }: { count: number | null; variant: 'card' | 'highlight' }) {
  if (variant === 'card') {
    return (
      <Link
        href={HREF}
        data-cta="hp-card"
        style={{ display: 'block', textDecoration: 'none', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 12, padding: '20px 24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 4 }}>
              {TITLE}
            </div>
            <div style={{ fontSize: 13, color: 'var(--clr-text-med)' }}>
              Part of Air Regulations · RK Bali chapter {HUMAN_PERFORMANCE.chapter}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--clr-primary)', fontFamily: 'var(--font-outfit),sans-serif' }}>
              {count != null ? count.toLocaleString() : '—'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--clr-text-med)', marginTop: 1 }}>practice questions</div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={HREF}
      data-cta="hp-card"
      style={{ display: 'block', textDecoration: 'none', background: 'var(--clr-pri-light)', border: '1.5px solid var(--clr-primary)', borderRadius: 12, padding: '14px 18px', marginBottom: 32 }}
    >
      <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 2 }}>
        {TITLE}
      </div>
      <div style={{ fontSize: 13, color: 'var(--clr-text-med)', lineHeight: 1.5 }}>
        Part of Air Regulations · RK Bali chapter {HUMAN_PERFORMANCE.chapter}
        {count != null && ` · ${count.toLocaleString()} practice questions`}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--clr-primary)', marginTop: 8 }}>
        Practise Human Performance →
      </div>
    </Link>
  )
}
