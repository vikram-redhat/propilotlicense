import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'

import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'Terms of Use — ProPilotLicence',
  description: 'Terms of use for ProPilotLicence.com — the DGCA CPL and ATPL theory examination preparation platform.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--clr-primary)' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-slate-800">ProPilotLicence</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">Terms of Use</span>
        </div>
      </header>

      <main className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto prose prose-sm prose-slate">

          <h1 className="text-2xl font-black text-slate-900 mb-2">Terms of Use</h1>
          <p className="text-sm text-slate-400 mb-10">Last updated: June 2026</p>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 mb-3">1. About This Platform</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              ProPilotLicence.com is an independent examination preparation platform designed to help candidates preparing for DGCA (Directorate General of Civil Aviation, India) CPL and ATPL theory examinations. This platform is operated independently and is not affiliated with, endorsed by, or associated with the DGCA, any aviation authority, or any textbook publisher.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 mb-3">2. Intellectual Property</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              All practice questions, explanations, and platform content published on ProPilotLicence.com are original works created independently for examination preparation purposes. Reference to third-party publications — including textbook titles, author names, chapter references, and page numbers — is made solely for the purpose of study attribution and does not constitute reproduction, endorsement, or affiliation.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              ProPilotLicence.com respects the intellectual property rights of all authors and publishers. If you believe any content on this platform infringes your rights, please contact us at help@propilotlicence.com and we will respond promptly.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Users of this platform may not reproduce, distribute, or republish any question content without express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 mb-3">3. Reference Materials</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Textbooks and publications referenced on this platform are prescribed by the DGCA as reference material for CPL and ATPL theory examinations. They are listed for the benefit of students and to provide citation context for practice questions. All titles, author names, and trademarks remain the property of their respective owners. ProPilotLicence.com has no commercial relationship with any of these publishers or authors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 mb-3">4. Question Content</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Practice questions on this platform are written and reviewed by licensed commercial pilots. While we make every effort to ensure accuracy, questions are intended for study purposes only and should not be relied upon as the sole source of examination preparation. Always consult prescribed textbooks and official DGCA syllabi.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 mb-3">5. Accuracy and Liability</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              ProPilotLicence.com makes no warranty as to the accuracy, completeness, or fitness for purpose of any content on this platform. Use of this platform is at your own risk. We accept no liability for outcomes in examinations or any other context arising from use of this platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 mb-3">6. Privacy</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              When you create an account, we collect and store your email address and session history to provide the service. We do not sell your personal data. Payment processing is handled by Razorpay; we do not store card details.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              For full details, see our <Link href="/privacy" className="font-medium hover:underline" style={{ color: 'var(--clr-primary)' }}>Privacy Policy</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 mb-3">7. Changes to These Terms</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              These terms may be updated from time to time. Continued use of the platform following any update constitutes acceptance of the revised terms.
            </p>
          </section>

          <div className="mt-10 pt-6 border-t border-slate-100">
            <Link href="/" className="text-sm font-medium hover:underline" style={{ color: 'var(--clr-primary)' }}>
              ← Back to ProPilotLicence
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
