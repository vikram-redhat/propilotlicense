import LandingHeader from '@/components/LandingHeader'
import { getHeaderAuthState } from '@/lib/supabase-server'
import SiteFooter from '@/components/SiteFooter'
import { ArticleSchema } from '@/components/schema/ArticleSchema'
import { FAQSchema } from '@/components/schema/FAQSchema'
import { buildMetadata } from '@/lib/metadata'
import { Breadcrumb } from '@/components/guides/ArticleKit'
import { faqsFromHtml } from '@/lib/chapter-pages'
import { getPost } from '@/lib/guides'
import { ARTICLE_HTML } from './articleBody'
import styles from './styles.module.css'

// Dates come from the guide registry, so the Article schema and the sitemap agree.
const POST = getPost('dgca-exam-guides', 'bharatiya-vayuyan-adhiniyam-2024')!
const PATH = '/guides/dgca-exam-guides/bharatiya-vayuyan-adhiniyam-2024'
const H1 = 'Bharatiya Vayuyan Adhiniyam 2024: The New Aircraft Act Explained for Pilots'

export const metadata = buildMetadata({
  title: POST.metaTitle,
  description: POST.metaDescription,
  path: PATH,
})

// The visible "Updated" date in the byline is generated from updatedAt.
const html = ARTICLE_HTML.replace('{{UPDATED}}',
  new Date(POST.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }))

export default async function BharatiyaVayuyanAdhiniyamPage() {
  const { isLoggedIn, name } = await getHeaderAuthState()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <ArticleSchema
        title={H1}
        description={POST.metaDescription}
        url={`https://www.propilotlicence.com${PATH}`}
        publishedAt={POST.publishedAt}
        updatedAt={POST.updatedAt}
        about={{ '@type': 'Legislation', name: 'Bharatiya Vayuyan Adhiniyam, 2024' }}
      />
      {/* Built from the visible FAQ section, so the schema can't drift from the page. */}
      <FAQSchema faqs={faqsFromHtml(html)} />
      <LandingHeader isLoggedIn={isLoggedIn} name={name} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 0' }}>
        <Breadcrumb seriesSlug="dgca-exam-guides" seriesLabel="DGCA Exam Guides" current="Bharatiya Vayuyan Adhiniyam 2024" />
      </div>

      <main className={styles.wrap} style={{ paddingTop: 8 }}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </main>

      <SiteFooter />
    </div>
  )
}
