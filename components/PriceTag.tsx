'use client'
import { getRegion } from '@/lib/detect-region'

// ponytail: show currency based on region, no alternate currency info for international users
export default function PriceTag({ inr, usd }: { inr: number; usd: number }) {
  const isIndia = getRegion() === 'IN'
  return (
    <>
      <p className="text-3xl font-bold text-slate-900 mb-1">
        {isIndia ? `₹${inr}` : `$${usd}`}
      </p>
      {isIndia && (
        <p className="text-xs text-slate-400">${usd} for international users</p>
      )}
    </>
  )
}

// Dynamic savings tag based on region
export function DiscountTag() {
  const isIndia = getRegion() === 'IN'
  return (
    <p className="text-xs font-medium text-green-600 mb-5">
      {isIndia ? 'Save ₹151 vs 3× monthly' : 'Save $2.50 vs 3× monthly'}
    </p>
  )
}
