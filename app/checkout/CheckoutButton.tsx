'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CheckoutButton({
  plan,
  amount,
}: {
  plan: '30days' | '90days'
  amount: number
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handlePay() {
    setLoading(true)

    // Ensure user is signed in before payment
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push(`/login?next=/checkout?plan=${plan}`)
      return
    }

    // ── STUB ─────────────────────────────────────────────────────────────────
    // Sash: replace this block with Razorpay client-side checkout:
    //
    // 1. Create order:
    //    const { orderId } = await fetch('/api/payment/create-order', {
    //      method: 'POST', body: JSON.stringify({ plan }),
    //      headers: { 'Content-Type': 'application/json' },
    //    }).then(r => r.json())
    //
    // 2. Open Razorpay modal:
    //    const rzp = new window.Razorpay({
    //      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    //      order_id: orderId,
    //      amount: amount * 100,
    //      currency: 'INR',
    //      name: 'ProPilotLicence',
    //      notes: { plan, userId: user.id },
    //      handler: async (response) => {
    //        await fetch('/api/payment/verify', {
    //          method: 'POST',
    //          body: JSON.stringify({ ...response, plan }),
    //          headers: { 'Content-Type': 'application/json' },
    //        })
    //        router.push('/checkout/success')
    //      },
    //    })
    //    rzp.open()
    //
    // 3. Add to <head>: <script src="https://checkout.razorpay.com/v1/checkout.js" />
    // ─────────────────────────────────────────────────────────────────────────

    // Stub: directly activate subscription (dev/testing only)
    const res = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: 'stub_order',
        razorpay_payment_id: 'stub_payment',
        razorpay_signature: 'stub_signature',
        plan,
      }),
    })
    if (res.ok) {
      router.push('/checkout/success')
    } else {
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full rounded-xl py-3.5 font-semibold text-white text-sm transition-all disabled:opacity-60 hover:opacity-90"
      style={{ backgroundColor: '#185FA5' }}
    >
      {loading ? 'Processing…' : `Pay ₹${amount} →`}
    </button>
  )
}
