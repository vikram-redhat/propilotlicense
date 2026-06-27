import { createAuthClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 })

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
    await req.json() as {
      razorpay_order_id: string
      razorpay_payment_id: string
      razorpay_signature: string
      plan: '30days' | '90days'
    }

  // ── STUB ─────────────────────────────────────────────────────────────────
  // Sash: add signature verification before activating:
  //
  // import crypto from 'crypto'
  // const body = razorpay_order_id + '|' + razorpay_payment_id
  // const expected = crypto
  //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
  //   .update(body).digest('hex')
  // if (expected !== razorpay_signature) {
  //   return Response.json({ error: 'Invalid signature' }, { status: 400 })
  // }
  // ─────────────────────────────────────────────────────────────────────────

  void razorpay_order_id; void razorpay_payment_id; void razorpay_signature

  if (plan !== '30days' && plan !== '90days') {
    return Response.json({ error: 'Invalid plan' }, { status: 400 })
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

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ success: true, expiresAt: expiresAt.toISOString() })
}
