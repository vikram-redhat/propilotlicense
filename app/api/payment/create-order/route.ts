import { createAuthClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const authClient = await createAuthClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 })

    const { plan, currency: rawCurrency } = await req.json() as { plan: '30days' | '90days'; currency?: string }
    if (plan !== '30days' && plan !== '90days') {
      return Response.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const currency = rawCurrency === 'USD' ? 'USD' : 'INR' // ponytail: default INR
    const days = plan === '90days' ? 90 : 30

    // Smallest currency unit: paise for INR, cents for USD
    const PRICES = {
      INR: { '30days': 25000, '90days': 59900 },
      USD: { '30days': 300, '90days': 650 },
    } as const
    const amount = PRICES[currency][plan]

    // Create order via Razorpay REST API
    const credentials = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString('base64')

    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: `order_${Date.now()}`,
        notes: { plan, days: String(days), userId: user.id },
      }),
    })

    if (!razorpayRes.ok) {
      const err = await razorpayRes.json()
      console.error('Razorpay order creation failed:', err)
      const description = err?.error?.description || 'Failed to create order'
      return Response.json({ error: description }, { status: 500 })
    }

    const order = await razorpayRes.json()

    return Response.json({
      orderId: order.id,
      amount,
      currency,
      plan,
      days,
    })
  } catch (err: any) {
    console.error('API create-order error:', err)
    return Response.json({ error: err.message || String(err) }, { status: 500 })
  }
}
