import Link from 'next/link'
import LandingHeader from '@/components/LandingHeader'
import SiteFooter from '@/components/SiteFooter'
import type { GuideSeries } from '@/lib/guides'

export function SeriesHubPage({ series }: { series: GuideSeries }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <LandingHeader isLoggedIn={false} name={null} />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 96px' }}>
        <nav style={{ fontSize: 13, color: 'var(--clr-text-med)', marginBottom: 24 }}>
          <Link href="/guides" style={{ color: 'var(--clr-text-med)', textDecoration: 'none' }}>Guides</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>{series.navLabel}</span>
        </nav>

        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 8 }}>
          {series.title}
        </h1>
        <p style={{ fontSize: 16, color: 'var(--clr-text-med)', lineHeight: 1.65, marginBottom: 40 }}>
          {series.description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {series.posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/guides/${series.slug}/${post.slug}`}
              style={{ display: 'block', textDecoration: 'none', border: '1px solid var(--clr-border)', borderRadius: 12, padding: '20px 24px', background: 'var(--clr-surface)' }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--clr-primary)', marginBottom: 8 }}>
                Article {i + 1} of {series.posts.length}
              </div>
              <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--clr-text)', lineHeight: 1.3, marginBottom: 8 }}>
                {post.title}
              </div>
              <p style={{ fontSize: 14, color: 'var(--clr-text-med)', lineHeight: 1.6, margin: 0 }}>
                {post.excerpt}
              </p>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--clr-text-med)', display: 'flex', gap: 12, alignItems: 'center' }}>
                {post.reviewedBy && <><span>Reviewed by {post.reviewedBy}</span><span>·</span></>}
                <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
