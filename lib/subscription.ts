import type { Profile } from '@/lib/types'

export type SubscriptionStatus = 'free' | 'active' | 'expired'

export function getSubscriptionStatus(profile: Profile | null): SubscriptionStatus {
  if (!profile || profile.subscription_tier !== 'paid') return 'free'
  if (!profile.subscription_expires_at) return 'free'
  return new Date(profile.subscription_expires_at) > new Date() ? 'active' : 'expired'
}

export function isSubscribed(profile: Profile | null): boolean {
  return getSubscriptionStatus(profile) === 'active'
}

export function daysRemaining(profile: Profile | null): number | null {
  if (!profile?.subscription_expires_at) return null
  const diff = new Date(profile.subscription_expires_at).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
