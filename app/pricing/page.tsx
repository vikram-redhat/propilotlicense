import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#185FA5' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-lg">ProPilotLicence</span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Sign in →
          </Link>
        </div>
      </header>

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
            <p className="text-3xl font-bold text-slate-900 mb-1">₹250</p>
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
              style={{ backgroundColor: '#185FA5' }}
            >
              Get 30 days →
            </Link>
          </div>

          {/* 90 days */}
          <div className="bg-white border-2 rounded-2xl p-6 relative" style={{ borderColor: '#185FA5' }}>
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="text-xs font-semibold text-white px-3 py-1 rounded-full" style={{ backgroundColor: '#185FA5' }}>
                Best value
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">90 Days</p>
            <p className="text-3xl font-bold text-slate-900 mb-1">₹599</p>
            <p className="text-sm text-slate-400 mb-1">one-time · no renewal</p>
            <p className="text-xs font-medium text-green-600 mb-5">Save ₹151 vs 3× monthly</p>
            <ul className="space-y-2.5 text-sm mb-8">
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> Everything in 30 Days</li>
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> 90 days full access</li>
              <li className="flex items-start gap-2 text-slate-600"><span className="text-green-500 mt-0.5">✓</span> Covers a full exam cycle</li>
            </ul>
            <Link
              href="/checkout?plan=90days"
              className="block text-center rounded-xl py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#185FA5' }}
            >
              Get 90 days →
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Payments processed securely via Razorpay · UPI · Cards · Net banking.
          Access activates immediately after payment. No subscriptions — no auto-renewal.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}
