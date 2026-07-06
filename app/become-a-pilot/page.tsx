import Link from 'next/link'
import LandingHeader from '@/components/LandingHeader'
import SiteFooter from '@/components/SiteFooter'
import { buildMetadata } from '@/lib/metadata'
import { BECOME_A_PILOT_POSTS } from '@/lib/become-a-pilot'

export const metadata = buildMetadata({
  title: 'Become a Pilot in India — Career Transition Guides | ProPilotLicence',
  description:
    'Practical guides for aviation professionals considering the transition to commercial pilot in India. Cabin crew, AMEs, and operations staff — honest costs, timelines, and what your background gives you.',
  path: '/become-a-pilot',
})

export default function BecomeAPilotIndexPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <LandingHeader isLoggedIn={false} name={null} />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 96px' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 8 }}>
          Become a Pilot in India
        </h1>
        <p style={{ fontSize: 16, color: 'var(--clr-text-med)', lineHeight: 1.65, marginBottom: 8 }}>
          Practical, unsentimental guides for aviation professionals considering the transition to commercial pilot. Honest costs, realistic timelines, and what your existing background gives you — and what it does not.
        </p>
        <p style={{ fontSize: 14, color: 'var(--clr-text-med)', marginBottom: 40 }}>
          Reviewed by the ProPilotLicence Captain Panel — active commercial airline captains holding current DGCA CPL and ATPL licences.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {BECOME_A_PILOT_POSTS.map((post, i) => (
            <Link
              key={post.slug}
              href={`/become-a-pilot/${post.slug}`}
              style={{ display: 'block', textDecoration: 'none', border: '1px solid var(--clr-border)', borderRadius: 12, padding: '20px 24px', background: 'var(--clr-surface)' }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--clr-primary)', marginBottom: 8 }}>
                Article {i + 1} of {BECOME_A_PILOT_POSTS.length}
              </div>
              <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--clr-text)', lineHeight: 1.3, marginBottom: 8 }}>
                {post.title}
              </div>
              <p style={{ fontSize: 14, color: 'var(--clr-text-med)', lineHeight: 1.6, margin: 0 }}>
                {post.excerpt}
              </p>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--clr-text-med)', display: 'flex', gap: 12, alignItems: 'center' }}>
                <span>Reviewed by ProPilotLicence Captain Panel</span>
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
