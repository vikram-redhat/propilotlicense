import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { buildMetadata } from '@/lib/metadata'
import { BLOG_POSTS } from '@/lib/blog-posts'

export const metadata = buildMetadata({
  title: 'DGCA CPL Exam Guides — Blog | ProPilotLicence',
  description:
    'Guides and resources for DGCA CPL and ATPL theory examinations, reviewed by active commercial airline captains.',
  path: '/blog',
})

export default function BlogIndexPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <SiteHeader right={<Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: 'var(--clr-primary)', textDecoration: 'none', padding: '5px 4px' }}>Log in</Link>} />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 96px' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 8 }}>
          DGCA Exam Guides
        </h1>
        <p style={{ fontSize: 16, color: 'var(--clr-text-med)', lineHeight: 1.6, marginBottom: 48 }}>
          Guides written for CPL and ATPL candidates, reviewed by the ProPilotLicence captain panel.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ display: 'block', textDecoration: 'none', border: '1px solid var(--clr-border)', borderRadius: 12, padding: '20px 24px', background: 'var(--clr-surface)' }}
            >
              <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--clr-text)', lineHeight: 1.3, marginBottom: 8 }}>
                {post.title}
              </div>
              <p style={{ fontSize: 14, color: 'var(--clr-text-med)', lineHeight: 1.6, margin: 0 }}>
                {post.excerpt}
              </p>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--clr-text-med)', display: 'flex', gap: 12, alignItems: 'center' }}>
                <span>Reviewed by {post.reviewedBy}</span>
                <span>·</span>
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
