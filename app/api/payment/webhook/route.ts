import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  // Verify webhook signature — reject if secret is not configured
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not set')
    return new Response('Webhook not configured', { status: 500 })
  }
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex')
  if (expectedSignature !== signature) {
    console.error('Webhook signature verification failed')
    return new Response('Invalid signature', { status: 400 })
  }

  let event: { event: string; payload: { payment: { entity: { notes?: { plan?: string; userId?: string } } } } }
  try {
    event = JSON.parse(body)
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  if (event.event === 'payment.captured') {
    const notes = event.payload.payment.entity.notes ?? {}
    const plan = notes.plan as '30days' | '90days' | undefined
    const userId = notes.userId

    if (!userId || !plan || (plan !== '30days' && plan !== '90days')) {
      return new Response('Missing or invalid notes', { status: 400 })
    }

    const days = plan === '90days' ? 90 : 30
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + days)

    const supabase = createServiceClient()
    await supabase
      .from('profiles')
      .update({
        subscription_tier: 'paid',
        subscription_plan: plan,
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('id', userId)
  }

  return new Response('OK', { status: 200 })
}
