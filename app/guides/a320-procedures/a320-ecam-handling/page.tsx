import Link from 'next/link'
import LandingHeader from '@/components/LandingHeader'
import { getHeaderAuthState } from '@/lib/supabase-server'
import SiteFooter from '@/components/SiteFooter'
import { ArticleSchema } from '@/components/schema/ArticleSchema'
import { buildMetadata } from '@/lib/metadata'
import { Breadcrumb } from '@/components/guides/ArticleKit'
import A320SeriesNav from '@/components/guides/A320SeriesNav'
import A320InlineCta from '@/components/guides/A320InlineCta'
import { A320_PROCEDURES_SERIES } from '@/lib/a320-series'
import { ARTICLE_HEAD, ARTICLE_BODY, ARTICLE_BODY_2 } from './articleBody'
import styles from './styles.module.css'

export const metadata = buildMetadata({
  title: 'A320 ECAM Handling Philosophy — Alert Levels & Task Sharing | ProPilotLicence',
  description:
    'The complete A320 ECAM handling guide for type rating and ATPL candidates. Display architecture, alert levels, aural warnings, flight phase inhibition, PF/PM task sharing, STATUS page, and ECAM versus QRH.',
  path: '/guides/a320-procedures/a320-ecam-handling',
})

export default async function A320EcamHandlingPage() {
  const { isLoggedIn, name } = await getHeaderAuthState()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <ArticleSchema
        title="A320 ECAM Handling Philosophy — Alert Levels, Task Sharing and Actions"
        description="The complete A320 ECAM handling guide for type rating and ATPL candidates. Display architecture, alert levels, aural warnings, flight phase inhibition, PF/PM task sharing, STATUS page, and ECAM versus QRH."
        url="https://propilotlicence.com/guides/a320-procedures/a320-ecam-handling"
        publishedAt="2026-10-15"
        updatedAt="2026-10-15"
      />
      <LandingHeader isLoggedIn={isLoggedIn} name={name} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 0' }}>
        <Breadcrumb seriesSlug="a320-procedures" seriesLabel="A320 Operations and Procedures" current="A320 ECAM Handling" />
      </div>

      <main className={styles.wrap} style={{ paddingTop: 8 }}>
        <div dangerouslySetInnerHTML={{ __html: ARTICLE_HEAD }} />
        <A320SeriesNav currentSlug="a320-ecam-handling" series={A320_PROCEDURES_SERIES}>
          Related: the <Link href="/guides/dgca-exam-guides/a320-hydraulic-system" style={{ color: 'var(--clr-primary)', textDecoration: 'none' }}>A320 Systems Series</Link> covers the systems whose failures generate the ECAM warnings discussed here.
        </A320SeriesNav>
        <A320InlineCta />
        <div dangerouslySetInnerHTML={{ __html: ARTICLE_BODY }} />
        <A320InlineCta />
        <div dangerouslySetInnerHTML={{ __html: ARTICLE_BODY_2 }} />
      </main>

      <SiteFooter />
    </div>
  )
}
