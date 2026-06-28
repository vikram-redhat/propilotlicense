import { createAuthClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 })

  const { plan } = await req.json() as { plan: '30days' | '90days' }
  if (plan !== '30days' && plan !== '90days') {
    return Response.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const amount = plan === '90days' ? 59900 : 25000 // paise (₹ × 100)
  const days   = plan === '90days' ? 90 : 30

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
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: { plan, days: String(days), userId: user.id },
    }),
  })

  if (!razorpayRes.ok) {
    const err = await razorpayRes.json()
    console.error('Razorpay order creation failed:', err)
    return Response.json({ error: 'Failed to create order' }, { status: 500 })
  }

  const order = await razorpayRes.json()

  return Response.json({
    orderId: order.id,
    amount,
    currency: 'INR',
    plan,
    days,
  })
}
