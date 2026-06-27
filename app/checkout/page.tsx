import { redirect } from 'next/navigation'
import Link from 'next/link'
import CheckoutButton from './CheckoutButton'

const PLANS = {
  '30days': { label: '30 Day Access', amount: 250, days: 30 },
  '90days': { label: '90 Day Access', amount: 600, days: 90 },
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>
}) {
  const { plan } = await searchParams
  if (plan !== '30days' && plan !== '90days') redirect('/pricing')
  const { label, amount, days } = PLANS[plan]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#185FA5' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-slate-800">ProPilotLicence</span>
          </Link>
          <Link href="/pricing" className="text-sm text-slate-400 hover:text-slate-600">← Back to pricing</Link>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 pt-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete your purchase</h1>
          <p className="text-slate-500 mb-8 text-sm">{days} days full access · ₹{amount} · No auto-renewal</p>

          {/* Order summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-700 font-medium">ProPilotLicence — {label}</span>
              <span className="font-semibold text-slate-900">₹{amount}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Valid for {days} days from activation</span>
              <span>One-time payment</span>
            </div>
          </div>

          {/* Stub Pay button — Sash replaces with Razorpay checkout */}
          <CheckoutButton plan={plan} amount={amount} />

          <p className="text-center text-xs text-slate-400 mt-4">
            Secured by Razorpay · UPI · Cards · Net banking
          </p>
        </div>
      </main>
    </div>
  )
}
