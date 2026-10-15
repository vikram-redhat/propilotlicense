import Link from 'next/link'
import type { ReactNode } from 'react'
import { A320_SYSTEMS_SERIES, type A320Series } from '@/lib/a320-series'

// Shared in-article nav for the A320 article series, rendered from the lists in
// lib/a320-series.ts. Published siblings link; the current article is bold and
// unlinked; unpublished entries are italic "coming soon". `children` renders as
// a cross-reference footer under the list. Inline styles use site palette tokens
// and defensively reset list spacing so it renders identically whether or not it
// sits inside an article's scoped CSS module.
export default function A320SeriesNav({ currentSlug, series = A320_SYSTEMS_SERIES, children }: {
  currentSlug: string
  series?: A320Series
  children?: ReactNode
}) {
  return (
    <div style={{ background: 'var(--clr-surf-alt)', border: '1px solid var(--clr-border)', borderRadius: 10, padding: '16px 20px', marginBottom: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--clr-text-med)', marginBottom: 10 }}>
        {series.label}
      </div>
      <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, padding: 0, margin: 0 }}>
        {series.items.map((item) => {
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
                ? <Link href={`/guides/${series.guideSeries}/${item.slug}`} style={{ color: 'var(--clr-primary)', textDecoration: 'none' }}>{text}</Link>
                : text}
            </li>
          )
        })}
      </ol>
      {children && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--clr-border)', fontSize: 13, color: 'var(--clr-text-med)', lineHeight: 1.6 }}>
          {children}
        </div>
      )}
    </div>
  )
}
