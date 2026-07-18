import Link from 'next/link'
import LandingHeader from '@/components/LandingHeader'
import SiteFooter from '@/components/SiteFooter'
import PriceTag, { DiscountTag } from '@/components/PriceTag'
import { buildMetadata } from '@/lib/metadata'
import { getHeaderAuthState } from '@/lib/supabase-server'

export const metadata = buildMetadata({
  title: 'Pricing — ProPilotLicence DGCA Exam Prep',
  description: 'Simple pricing for DGCA CPL and ATPL theory exam preparation. ₹250 for 30 days, ₹599 for 90 days. No subscription, no auto-renewal.',
  path: '/pricing',
})

export default async function PricingPage() {
  const { isLoggedIn, name } = await getHeaderAuthState()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--clr-surface)' }}>
      <LandingHeader isLoggedIn={isLoggedIn} name={name} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Simple, honest pricing</h1>
          <p className="text-slate-500">No auto-renewal. No surprises. Pay for the days you need.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-sm font-medium text-slate-500 mb-1">Free</p>
            <p className="text-3xl font-bold text-slate-900 mb-1">₹0</p>
            <p className="text-sm text-slate-400 mb-6">forever</p>
            <ul className="space-y-2.5 text-sm mb-8">
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> Practice mode</li>
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> Combined paper only</li>
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> 10 questions per session</li>
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> Full explanations</li>
              <li className="flex items-start gap-2 text-slate-400"><span className="mt-0.5">✗</span> Mock exams</li>
              <li className="flex items-start gap-2 text-slate-400"><span className="mt-0.5">✗</span> Book/chapter sessions</li>
              <li className="flex items-start gap-2 text-slate-400"><span className="mt-0.5">✗</span> Topic sessions</li>
              <li className="flex items-start gap-2 text-slate-400"><span className="mt-0.5">✗</span> Difficulty selection</li>
            </ul>
            <Link
              href="/cpl"
              className="block text-center border border-slate-200 rounded-xl py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Start free →
            </Link>
          </div>

          {/* 30 days */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-sm font-medium text-slate-500 mb-1">30 Days</p>
            <PriceTag inr={250} usd={3} />
            <p className="text-sm text-slate-400 mb-6">one-time · no renewal</p>
            <ul className="space-y-2.5 text-sm mb-8">
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> Everything in Free</li>
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> Mock exams with timer</li>
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> 50 or 100 questions</li>
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> By book sessions</li>
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> By chapter sessions</li>
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> By topic sessions</li>
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> Basic / Advanced difficulty</li>
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> Full question bank</li>
            </ul>
            <Link
              href="/checkout?plan=30days"
              className="block text-center rounded-xl py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--clr-primary)' }}
            >
              Get 30 days →
            </Link>
          </div>

          {/* 90 days */}
          <div className="bg-white border-2 rounded-2xl p-6 relative" style={{ borderColor: 'var(--clr-primary)' }}>
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="text-xs font-semibold text-white px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--clr-primary)' }}>
                Best value
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">90 Days</p>
            <PriceTag inr={599} usd={6.50} />
            <p className="text-sm text-slate-400 mb-1">one-time · no renewal</p>
            <DiscountTag />
            <ul className="space-y-2.5 text-sm mb-8">
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> Everything in 30 Days</li>
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> 90 days full access</li>
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> Covers a full exam cycle</li>
            </ul>
            <Link
              href="/checkout?plan=90days"
              className="block text-center rounded-xl py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--clr-primary)' }}
            >
              Get 90 days →
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Payments processed securely via Razorpay · UPI · Cards · Net banking.
          Access activates immediately after payment. No subscriptions — no auto-renewal.
        </p>
        <p className="text-center text-xs mt-6" style={{ color: 'var(--clr-text-med)' }}>
          Every question on ProPilotLicence is verified by a panel of four or more active commercial airline captains before entering the question bank.{' '}
          <Link href="/about" style={{ color: 'var(--clr-primary)', fontWeight: 600, textDecoration: 'none' }}>Learn more →</Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
