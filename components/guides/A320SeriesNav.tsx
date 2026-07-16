import Link from 'next/link'
import { A320_SERIES } from '@/lib/a320-series'

// Shared in-article nav for the A320 Systems Series, rendered from the single
// A320_SERIES list. Published siblings link; the current article is bold and
// unlinked; unpublished entries are italic "coming soon". Inline styles use site
// palette tokens and defensively reset list spacing so it renders identically
// whether or not it sits inside an article's scoped CSS module.
export default function A320SeriesNav({ currentSlug }: { currentSlug: string }) {
  return (
    <div style={{ background: 'var(--clr-surf-alt)', border: '1px solid var(--clr-border)', borderRadius: 10, padding: '16px 20px', marginBottom: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--clr-text-med)', marginBottom: 10 }}>
        A320 Systems Series
      </div>
      <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, padding: 0, margin: 0 }}>
        {A320_SERIES.map((item) => {
          const isCurrent = item.slug === currentSlug
          const upcoming = !item.slug
          const text = `${item.n}. ${item.label}`
          return (
            <li
              key={item.n}
              style={{
                margin: 0,
                fontSize: 14,
                color: isCurrent ? 'var(--clr-text)' : 'var(--clr-text-med)',
                fontWeight: isCurrent ? 600 : 400,
                fontStyle: upcoming ? 'italic' : 'normal',
              }}
            >
              {item.slug && !isCurrent
                ? <Link href={`/guides/dgca-exam-guides/${item.slug}`} style={{ color: 'var(--clr-primary)', textDecoration: 'none' }}>{text}</Link>
                : text}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
