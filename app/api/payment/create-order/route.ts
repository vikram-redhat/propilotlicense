import { createAuthClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 })

  const { plan } = await req.json() as { plan: '30days' | '90days' }
  if (plan !== '30days' && plan !== '90days') {
    return Response.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const amount = plan === '90days' ? 60000 : 25000 // paise (₹ × 100)
  const days   = plan === '90days' ? 90 : 30

  // ── STUB ─────────────────────────────────────────────────────────────────
  // Sash: replace this block with Razorpay Orders API:
  //
  // const Razorpay = require('razorpay')
  // const razorpay = new Razorpay({
  //   key_id: process.env.RAZORPAY_KEY_ID,
  //   key_secret: process.env.RAZORPAY_KEY_SECRET,
  // })
  // const order = await razorpay.orders.create({
  //   amount,
  //   currency: 'INR',
  //   receipt: `order_${Date.now()}`,
  //   notes: { plan, days: String(days), userId: user.id },
  // })
  // return Response.json({ orderId: order.id, amount, currency: 'INR' })
  // ─────────────────────────────────────────────────────────────────────────

  return Response.json({
    orderId: `stub_order_${Date.now()}`,
    amount,
    currency: 'INR',
    plan,
    days,
  })
}
