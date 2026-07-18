'use client'
import { getRegion } from '@/lib/detect-region'

// ponytail: tiny client component to show the right currency on the pricing page
export default function PriceTag({ inr, usd }: { inr: number; usd: number | string }) {
  const isIndia = getRegion() === 'IN'
  return (
    <>
      <p className="text-3xl font-bold text-slate-900 mb-1">
        {isIndia ? `₹${inr}` : `$${usd}`}
      </p>
      {!isIndia && (
        <p className="text-xs text-slate-400">₹{inr} for Indian users</p>
      )}
      {isIndia && (
        <p className="text-xs text-slate-400">${usd} for international users</p>
      )}
    </>
  )
}
