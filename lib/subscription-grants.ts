import type { SupabaseClient } from '@supabase/supabase-js'

// Every time paid access is set, the server records how in subscription_grants
// (scripts/security_fix_roles_and_paid_20261119.sql): a Razorpay payment (verify or webhook)
// or an admin. Students can't write it, or change their own subscription columns.
// A failed log write never blocks the grant itself (the student has paid): it's logged.
export type GrantSource = 'razorpay_verify' | 'razorpay_webhook' | 'admin'

export async function recordGrant(svc: SupabaseClient, grant: {
  userId: string
  source: GrantSource
  plan: string | null
  expiresAt: string | null
  tier?: string | null
  razorpayOrderId?: string | null
  razorpayPaymentId?: string | null
  amount?: number | null
  currency?: string | null
  grantedBy?: string | null
}): Promise<void> {
  const { error } = await svc.from('subscription_grants').upsert({
    user_id: grant.userId,
    source: grant.source,
    tier: grant.tier ?? 'paid',
    plan: grant.plan,
    expires_at: grant.expiresAt,
    razorpay_order_id: grant.razorpayOrderId ?? null,
    razorpay_payment_id: grant.razorpayPaymentId ?? null,
    amount: grant.amount ?? null,
    currency: grant.currency ?? null,
    granted_by: grant.grantedBy ?? null,
  }, { onConflict: 'razorpay_payment_id,source', ignoreDuplicates: true })
  if (error) console.error('[subscription_grants] write failed:', error.message, grant)
}
