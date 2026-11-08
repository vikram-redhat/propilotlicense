import Link from 'next/link'

const SITE = 'https://www.propilotlicence.com'

export type Crumb = { name: string; href?: string }

// Visible breadcrumb trail plus matching BreadcrumbList JSON-LD, from one list so the
// two can't disagree. Every item except the last is a link to a page that exists; the
// last item is the current page (plain text, and no `item` URL in the schema, which
// Google allows for the final crumb).
export default function Breadcrumbs({ items, style }: { items: Crumb[]; style?: React.CSSProperties }) {
  const linkStyle = { color: 'var(--clr-text-med)', textDecoration: 'none' }
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.href && i < items.length - 1 ? { item: `${SITE}${c.href}` } : {}),
    })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: 'var(--clr-text-med)', marginBottom: 24, ...style }}>
        {items.map((c, i) => (
          <span key={i}>
            {i > 0 && <span style={{ margin: '0 6px' }}>›</span>}
            {c.href && i < items.length - 1
              ? <Link href={c.href} style={linkStyle}>{c.name}</Link>
              : <span>{c.name}</span>}
          </span>
        ))}
      </nav>
    </>
  )
}
