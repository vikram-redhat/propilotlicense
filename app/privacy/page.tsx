import Link from 'next/link'
import LandingHeader from '@/components/LandingHeader'
import SiteFooter from '@/components/SiteFooter'
import { buildMetadata } from '@/lib/metadata'
import { getHeaderAuthState } from '@/lib/supabase-server'

export const metadata = buildMetadata({
  title: 'Privacy Policy — ProPilotLicence',
  description: 'Privacy policy for ProPilotLicence.com — how we collect, use, and protect your data.',
  path: '/privacy',
})

export default async function PrivacyPage() {
  const { isLoggedIn, name } = await getHeaderAuthState()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <LandingHeader isLoggedIn={isLoggedIn} name={name} />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 96px' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 14, color: 'var(--clr-text-med)', marginBottom: 40 }}>Last updated: June 2026</p>

        <div style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--clr-text)', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <section>
            <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>1. Data we collect</h2>
            <p>When you create an account, we collect your email address and the information you provide during sign-up. When you use the practice platform, we store your session history, answers, and performance data to power your progress tracking.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>2. How we use your data</h2>
            <p>We use your data to provide the service: running practice sessions, tracking your progress, and processing payments. We do not sell your data to third parties. We do not use your data for advertising.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>3. Payment data</h2>
            <p>Payments are processed by Razorpay. We do not store card details. Razorpay&apos;s privacy policy governs data processed during payment.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>4. Data storage</h2>
            <p>Your data is stored on Supabase infrastructure. Data is processed and stored within the regions operated by Supabase and its underlying cloud providers.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>5. Your rights</h2>
            <p>You may request deletion of your account and associated data at any time by emailing{' '}
              <a href="mailto:help@propilotlicence.com" style={{ color: 'var(--clr-primary)', fontWeight: 600, textDecoration: 'none' }}>
                help@propilotlicence.com
              </a>
              . We will process deletion requests within 30 days.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>6. Contact</h2>
            <p>For privacy-related questions or requests:{' '}
              <a href="mailto:help@propilotlicence.com" style={{ color: 'var(--clr-primary)', fontWeight: 600, textDecoration: 'none' }}>
                help@propilotlicence.com
              </a>
            </p>
          </section>

          <p style={{ marginTop: 24, fontSize: 13, color: 'var(--clr-text-med)', borderTop: '1px solid var(--clr-border)', paddingTop: 20 }}>
            This privacy policy is governed by Indian law. ProPilotLicence.com is operated from India.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
