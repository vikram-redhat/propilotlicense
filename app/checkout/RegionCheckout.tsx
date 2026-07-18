'use client'
import { useState } from 'react'
import CheckoutButton from './CheckoutButton'

// ponytail: simple two-option toggle, no geo-IP
export default function RegionCheckout({
  plan,
  amountInr,
  amountUsd,
  label,
  days,
}: {
  plan: '30days' | '90days'
  amountInr: number
  amountUsd: number
  label: string
  days: number
}) {
  const [region, setRegion] = useState<'IN' | 'INTL'>('IN')

  const isIndia = region === 'IN'
  const amount = isIndia ? amountInr : amountUsd
  const currency = isIndia ? 'INR' : 'USD' as const
  const amountDisplay = isIndia ? `₹${amountInr}` : `$${amountUsd}`

  return (
    <>
      {/* Region selector */}
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-500 mb-2">Where are you paying from?</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRegion('IN')}
            className="rounded-lg border px-3 py-2.5 text-sm font-medium transition-all"
            style={{
              borderColor: isIndia ? 'var(--clr-primary)' : '#e2e8f0',
              backgroundColor: isIndia ? 'var(--clr-primary-light, rgba(99,102,241,0.06))' : 'white',
              color: isIndia ? 'var(--clr-primary)' : '#64748b',
            }}
          >
            🇮🇳 India (INR)
          </button>
          <button
            type="button"
            onClick={() => setRegion('INTL')}
            className="rounded-lg border px-3 py-2.5 text-sm font-medium transition-all"
            style={{
              borderColor: !isIndia ? 'var(--clr-primary)' : '#e2e8f0',
              backgroundColor: !isIndia ? 'var(--clr-primary-light, rgba(99,102,241,0.06))' : 'white',
              color: !isIndia ? 'var(--clr-primary)' : '#64748b',
            }}
          >
            🌍 Outside India (USD)
          </button>
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-700 font-medium">ProPilotLicence — {label}</span>
          <span className="font-semibold text-slate-900">{amountDisplay}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Valid for {days} days from activation</span>
          <span>One-time payment</span>
        </div>
      </div>

      <CheckoutButton plan={plan} amount={amount} currency={currency} amountDisplay={amountDisplay} />
    </>
  )
}
