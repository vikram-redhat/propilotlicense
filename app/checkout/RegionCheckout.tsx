'use client'
import CheckoutButton from './CheckoutButton'
import { getRegion } from '@/lib/detect-region'

// ponytail: no toggle — reads saved region, shows correct price
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
  const isIndia = getRegion() === 'IN'
  const amount = isIndia ? amountInr : amountUsd
  const currency = isIndia ? 'INR' : 'USD' as const
  const amountDisplay = isIndia ? `₹${amountInr}` : `$${amountUsd}`

  return (
    <>
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
