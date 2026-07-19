import LandingHeader from '@/components/LandingHeader'
import { getHeaderAuthState } from '@/lib/supabase-server'
import SiteFooter from '@/components/SiteFooter'
import { ArticleSchema } from '@/components/schema/ArticleSchema'
import { buildMetadata } from '@/lib/metadata'
import { Breadcrumb } from '@/components/guides/ArticleKit'
import A320SeriesNav from '@/components/guides/A320SeriesNav'
import A320InlineCta from '@/components/guides/A320InlineCta'
import { ARTICLE_HEAD, ARTICLE_BODY, ARTICLE_BODY_2 } from './articleBody'
import styles from './styles.module.css'

export const metadata = buildMetadata({
  title: 'A320 Flight Controls — Fly-by-Wire, Normal Law, Alternate Law, Direct Law & Sidestick | ProPilotLicence',
  description:
    'The complete A320 flight controls guide. Fly-by-wire architecture, ELAC/SEC/FAC computers, Normal law protections, Alternate law with and without protections, Direct law, sidestick design, priority logic and dual input handling.',
  path: '/guides/dgca-exam-guides/a320-flight-controls',
})

export default async function A320FlightControlsPage() {
  const { isLoggedIn, name } = await getHeaderAuthState()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <ArticleSchema
        title="A320 Flight Controls — Fly-by-Wire, Normal Law, Alternate Law, Direct Law and the Sidestick"
        description="The complete A320 flight controls guide for ATPL and type rating candidates. Fly-by-wire architecture, ELAC/SEC/FAC computers, Normal, Alternate and Direct law, sidestick priority logic and dual input handling."
        url="https://propilotlicence.com/guides/dgca-exam-guides/a320-flight-controls"
        publishedAt="2026-07-15"
        updatedAt="2026-07-15"
      />
      <LandingHeader isLoggedIn={isLoggedIn} name={name} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 0' }}>
        <Breadcrumb seriesSlug="dgca-exam-guides" seriesLabel="DGCA Exam Guides" current="A320 Flight Controls" />
      </div>

      <main className={styles.wrap} style={{ paddingTop: 8 }}>
        <div dangerouslySetInnerHTML={{ __html: ARTICLE_HEAD }} />
        <A320SeriesNav currentSlug="a320-flight-controls" />
        <A320InlineCta />
        <div dangerouslySetInnerHTML={{ __html: ARTICLE_BODY }} />
        <A320InlineCta />
        <div dangerouslySetInnerHTML={{ __html: ARTICLE_BODY_2 }} />
      </main>

      <SiteFooter />
    </div>
  )
}
