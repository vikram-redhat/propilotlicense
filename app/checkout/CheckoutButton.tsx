'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: string
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
  }) => void
  prefill?: { name?: string; email?: string; contact?: string }
  notes?: Record<string, string>
  theme?: { color?: string }
  modal?: { ondismiss?: () => void }
}

interface RazorpayInstance {
  open: () => void
  on: (event: string, handler: (response: RazorpayErrorResponse) => void) => void
}

interface RazorpayErrorResponse {
  error: {
    code: string
    description: string
    source: string
    step: string
    reason: string
    metadata: { order_id?: string; payment_id?: string }
  }
}

export default function CheckoutButton({
  plan,
  amount,
  currency = 'INR',
  amountDisplay,
}: {
  plan: '30days' | '90days'
  amount: number
  currency?: 'INR' | 'USD'
  amountDisplay?: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const label = amountDisplay ?? `₹${amount}`

  async function handlePay() {
    setLoading(true)

    // Ensure user is signed in before payment
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push(`/login?next=/checkout?plan=${plan}`)
      return
    }

    try {
      // 1. Create order on server
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({ plan, currency }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (!orderRes.ok) {
        let errorMessage = 'Failed to create order'
        try {
          const errBody = await orderRes.json()
          if (errBody?.error) errorMessage = errBody.error
        } catch (_) {}
        throw new Error(errorMessage)
      }

      const { orderId } = await orderRes.json()

      // 2. Open Razorpay checkout modal
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: String(amount * 100),
        currency,
        name: 'ProPilotLicence',
        description: `${plan === '90days' ? '90' : '30'} Day Access`,
        order_id: orderId,
        handler: async (response) => {
          // 3. Verify payment on server
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan,
            }),
            headers: { 'Content-Type': 'application/json' },
          })

          if (verifyRes.ok) {
            router.push('/checkout/success')
          } else {
            alert('Payment verification failed. Please contact support.')
            setLoading(false)
          }
        },
        prefill: {
          email: user.email ?? '',
        },
        notes: {
          plan,
          userId: user.id,
        },
        theme: {
          color: 'var(--clr-primary)',
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', (response: RazorpayErrorResponse) => {
        console.error('Payment failed:', response.error)
        alert(`Payment failed: ${response.error.description}`)
        setLoading(false)
      })

      rzp.open()
    } catch (err: any) {
      console.error('Checkout error:', err)
      alert(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full rounded-xl py-3.5 font-semibold text-white text-sm transition-all disabled:opacity-60 hover:opacity-90"
      style={{ backgroundColor: 'var(--clr-primary)' }}
    >
      {loading ? 'Processing…' : `Pay ${label} →`}
    </button>
  )
}
