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

// What a free account may start: the combined paper, up to 10 questions, practice mode.
// Returns the error code for the first rule a session breaks, or null if it's allowed.
// Used by every route that creates a session (start, practise the rest).
export function freeTierError({ scope, questionCount, mode }: { scope: string; questionCount: number; mode: string }):
  'free_tier_scope' | 'free_tier_count' | 'free_tier_mode' | null {
  if (scope !== 'combined') return 'free_tier_scope'
  if (questionCount > 10) return 'free_tier_count'
  if (mode === 'mock') return 'free_tier_mode'
  return null
}
