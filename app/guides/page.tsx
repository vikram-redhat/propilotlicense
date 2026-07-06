import Link from 'next/link'
import LandingHeader from '@/components/LandingHeader'
import SiteFooter from '@/components/SiteFooter'
import { buildMetadata } from '@/lib/metadata'
import { GUIDE_SERIES } from '@/lib/guides'

export const metadata = buildMetadata({
  title: 'Guides — DGCA Exam Prep & Career Advice | ProPilotLicence',
  description:
    'Guides and resources for DGCA CPL and ATPL candidates and aviation professionals — exam preparation guides and career transition series, reviewed by active airline captains.',
  path: '/guides',
})

export default function GuidesIndexPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <LandingHeader isLoggedIn={false} name={null} />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 96px' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 8 }}>
          Guides
        </h1>
        <p style={{ fontSize: 16, color: 'var(--clr-text-med)', lineHeight: 1.65, marginBottom: 40 }}>
          Everything ProPilotLicence publishes, organised by series — DGCA exam preparation and aviation career transitions, reviewed by the ProPilotLicence captain panel.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {GUIDE_SERIES.map(series => (
            <Link
              key={series.slug}
              href={`/guides/${series.slug}`}
              style={{ display: 'block', textDecoration: 'none', border: '1px solid var(--clr-border)', borderRadius: 12, padding: '22px 24px', background: 'var(--clr-surface)' }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--clr-primary)', marginBottom: 8 }}>
                {series.posts.length} article{series.posts.length !== 1 ? 's' : ''}
              </div>
              <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--clr-text)', lineHeight: 1.3, marginBottom: 8 }}>
                {series.title}
              </div>
              <p style={{ fontSize: 14, color: 'var(--clr-text-med)', lineHeight: 1.6, margin: 0 }}>
                {series.description}
              </p>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
