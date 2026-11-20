import { redirect } from 'next/navigation'
import { hubForExamType } from '@/lib/hub'
import { createAuthClient } from '@/lib/supabase-server'
import { NEW_RULES_PATH } from '@/lib/new-rules'
import StartNewRulesSession from './StartNewRulesSession'

// Entry point for the "New rules 2026" practice set (lib/new-rules.ts), linked from the
// Niyam and Adhiniyam guides. Not a public route: proxy.ts sends logged-out visitors to
// /signup?next=<this path>, and after signup (and profile setup) they come back here and the
// session starts straight away.
export default async function PracticeNewRulesPage() {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect(`/signup?next=${encodeURIComponent(NEW_RULES_PATH)}`)
  const licence = hubForExamType(user.user_metadata?.exam_type as string | undefined).slice(1) // 'cpl' | 'atpl'
  return <StartNewRulesSession licence={licence} />
}
