import { createServiceClient } from '@/lib/supabase'
import { createAuthClient } from '@/lib/supabase-server'
import { isSubscribed } from '@/lib/subscription'
import { isChapterTaster } from '@/lib/chapter-taster'
import { isNewRulesSession } from '@/lib/new-rules'
import { isAdminUser } from '@/lib/roles'

// Ends a session: the student reached the last question, the mock timer ran out, or they
// pressed End session / Submit. Records when it ended, whether questions were left
// unanswered, and how many were answered (scripts/migrate_session_end.sql). Returns the
// answered and correct counts and whether it was a chapter taster, which the client sends
// to GA4 as practice_complete.
export async function POST(req: Request) {
  const { sessionId, endedEarly } = await req.json()
  if (!sessionId) return Response.json({ error: 'Missing sessionId' }, { status: 400 })

  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data: session } = await supabase.from('sessions').select('id, user_id, scope, source_book_id').eq('id', sessionId).maybeSingle()
  if (!session || session.user_id !== user.id) return Response.json({ error: 'Not found' }, { status: 404 })

  const [{ data: answers, error }, { data: profile }] = await Promise.all([
    supabase.from('session_answers').select('is_correct').eq('session_id', sessionId),
    supabase.from('profiles').select('subscription_tier, subscription_expires_at').eq('id', user.id).single(),
  ])
  if (error) return Response.json({ error: error.message }, { status: 500 })
  const subscribed = isAdminUser(user) || isSubscribed(profile as Parameters<typeof isSubscribed>[0])
  // A free chapter taster, or a free account's one new-rules session (lib/new-rules.ts).
  const taster = isChapterTaster(session.scope, subscribed) || (!subscribed && isNewRulesSession(session.scope, session.source_book_id))
  const answered = answers.length
  const correct = answers.filter(a => a.is_correct).length

  const { error: updateError } = await supabase
    .from('sessions')
    .update({ ended_at: new Date().toISOString(), ended_early: endedEarly === true, answered_count: answered })
    .eq('id', sessionId)
  // 42703 / PGRST204 = the columns don't exist yet (migration not run): the results still
  // show, nothing is recorded.
  const recorded = !updateError
  if (updateError && updateError.code !== '42703' && updateError.code !== 'PGRST204') {
    return Response.json({ error: updateError.message }, { status: 500 })
  }

  return Response.json({ answered, correct, recorded, taster })
}
