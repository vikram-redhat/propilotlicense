import crypto from 'crypto'
import { createAuthClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase'
import { recordGrant } from '@/lib/subscription-grants'

// Called by the checkout page after Razorpay's payment window closes. The signature proves the
// payment belongs to the order; the plan and the account come from the order itself (its notes,
// set by create-order on the server), never from the browser, and the payment must be
// authorised or captured for the order's full amount.
type RazorpayOrder = { id: string; amount: number; currency: string; notes?: { plan?: string; userId?: string } }
type RazorpayPayment = { id: string; order_id: string; status: string; amount: number; currency: string }

async function razorpay<T>(path: string): Promise<T> {
  const credentials = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')
  const res = await fetch(`https://api.razorpay.com/v1/${path}`, { headers: { Authorization: `Basic ${credentials}` }, cache: 'no-store' })
  if (!res.ok) throw new Error(`Razorpay ${path}: HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export async function POST(req: Request) {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 })

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    await req.json() as {
      razorpay_order_id: string
      razorpay_payment_id: string
      razorpay_signature: string
    }

  // Verify payment signature (HMAC SHA256)
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')
  const given = String(razorpay_signature ?? '')
  if (given.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))) {
    console.error('Payment signature mismatch:', { razorpay_order_id, razorpay_payment_id })
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let order: RazorpayOrder, payment: RazorpayPayment
  try {
    [order, payment] = await Promise.all([
      razorpay<RazorpayOrder>(`orders/${encodeURIComponent(razorpay_order_id)}`),
      razorpay<RazorpayPayment>(`payments/${encodeURIComponent(razorpay_payment_id)}`),
    ])
  } catch (e) {
    console.error('Payment lookup failed:', e)
    return Response.json({ error: 'Could not confirm the payment with Razorpay' }, { status: 502 })
  }

  const plan = order.notes?.plan
  if (order.notes?.userId !== user.id) {
    console.error('Payment for another account:', { razorpay_order_id, user: user.id })
    return Response.json({ error: 'This payment belongs to another account' }, { status: 403 })
  }
  if (plan !== '30days' && plan !== '90days') {
    return Response.json({ error: 'Invalid plan' }, { status: 400 })
  }
  if (payment.order_id !== order.id || !['authorized', 'captured'].includes(payment.status)
      || payment.amount !== order.amount || payment.currency !== order.currency) {
    console.error('Payment does not match order:', { razorpay_order_id, razorpay_payment_id, status: payment.status })
    return Response.json({ error: 'Payment not complete' }, { status: 400 })
  }

  const days = plan === '90days' ? 90 : 30
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + days)

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_tier: 'paid',
      subscription_plan: plan,
      subscription_expires_at: expiresAt.toISOString(),
    })
    .eq('id', user.id)

  if (error) return Response.json({ error: 'Failed to activate subscription' }, { status: 500 })

  await recordGrant(supabase, {
    userId: user.id, source: 'razorpay_verify', plan, expiresAt: expiresAt.toISOString(),
    razorpayOrderId: order.id, razorpayPaymentId: payment.id, amount: payment.amount, currency: payment.currency,
  })

  return Response.json({ success: true, expiresAt: expiresAt.toISOString() })
}
