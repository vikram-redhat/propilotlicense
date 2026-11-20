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

// How the free tier is described everywhere it's offered (homepage, pricing, upgrade
// messages): keep them in step with the rules below and in lib/chapter-taster.ts.
export const FREE_TIER_LINE = '10 free questions every day, plus a free session on every Meteorology and Air Regulations chapter.'

// A free account gets one mixed-practice session a day, the day running midnight to midnight
// India time (chapter tasters don't count). /api/session/start refuses a second with this.
export const FREE_DAILY_ERROR = 'free_tier_daily'
export const FREE_DAILY_LINE = 'You’ve used today’s free session. Come back tomorrow, or upgrade for unlimited practice.'

// The start of today in India (midnight IST), as an ISO instant.
export function startOfTodayInIndia(now = new Date()): string {
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
  return new Date(`${day}T00:00:00+05:30`).toISOString()
}

// What a free account may start: the combined paper, up to 10 questions, practice mode,
// all difficulties. Returns the error code for the first rule a session breaks, or null if
// it's allowed. Used by every route that creates a session (start, practise the rest).
export function freeTierError({ scope, questionCount, mode, difficulty }: { scope: string; questionCount: number; mode: string; difficulty: string }):
  'free_tier_scope' | 'free_tier_count' | 'free_tier_mode' | typeof FREE_DIFFICULTY_ERROR | null {
  if (scope !== 'combined') return 'free_tier_scope'
  if (questionCount > 10) return 'free_tier_count'
  if (mode === 'mock') return 'free_tier_mode'
  if (difficulty !== 'all') return FREE_DIFFICULTY_ERROR
  return null
}

// Difficulty selection is paid only: a free account's sessions, tasters included, draw from
// all difficulties.
export const FREE_DIFFICULTY_ERROR = 'free_tier_difficulty'
