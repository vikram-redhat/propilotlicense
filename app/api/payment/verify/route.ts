import crypto from 'crypto'
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

  // Verify payment signature (HMAC SHA256)
  const body = razorpay_order_id + '|' + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    console.error('Payment signature mismatch:', { razorpay_order_id, razorpay_payment_id })
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

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

  if (error) return Response.json({ error: 'Failed to activate subscription' }, { status: 500 })

  return Response.json({ success: true, expiresAt: expiresAt.toISOString() })
}
