import LandingHeader from '@/components/LandingHeader'
import { getHeaderAuthState } from '@/lib/supabase-server'
import SiteFooter from '@/components/SiteFooter'
import { ArticleSchema } from '@/components/schema/ArticleSchema'
import { buildMetadata } from '@/lib/metadata'
import { Breadcrumb } from '@/components/guides/ArticleKit'
import A320SeriesNav from '@/components/guides/A320SeriesNav'
import { ARTICLE_HEAD, ARTICLE_BODY } from './articleBody'
import styles from './styles.module.css'

export const metadata = buildMetadata({
  title: 'A320 Hydraulic System — Complete Guide: Systems, Services, Failures & Effects | ProPilotLicence',
  description:
    'The complete A320 hydraulic system guide for type rating and ATPL candidates. All services powered by Green, Blue and Yellow systems, PTU, RAT, failure effects on flight controls, brakes, landing gear, flaps, slats and stabiliser.',
  path: '/guides/dgca-exam-guides/a320-hydraulic-system',
})

export default async function A320HydraulicSystemPage() {
  const { isLoggedIn, name } = await getHeaderAuthState()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <ArticleSchema
        title="A320 Hydraulic System — Complete Guide: Systems, Services, Failures and Effects"
        description="The complete A320 hydraulic system guide for type rating and ATPL candidates. Green, Blue and Yellow circuits, PTU, RAT, and failure effects on flight controls, brakes, landing gear, flaps and slats."
        url="https://propilotlicence.com/guides/dgca-exam-guides/a320-hydraulic-system"
        publishedAt="2026-07-16"
        updatedAt="2026-07-16"
      />
      <LandingHeader isLoggedIn={isLoggedIn} name={name} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 0' }}>
        <Breadcrumb seriesSlug="dgca-exam-guides" seriesLabel="DGCA Exam Guides" current="A320 Hydraulic System" />
      </div>

      <main className={styles.wrap} style={{ paddingTop: 8 }}>
        <div dangerouslySetInnerHTML={{ __html: ARTICLE_HEAD }} />
        <A320SeriesNav currentSlug="a320-hydraulic-system" />
        <div dangerouslySetInnerHTML={{ __html: ARTICLE_BODY }} />
      </main>

      <SiteFooter />
    </div>
  )
}
