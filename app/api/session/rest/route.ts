import { createServiceClient } from '@/lib/supabase'
import { createAuthClient } from '@/lib/supabase-server'
import { freeTierError, isSubscribed } from '@/lib/subscription'

// "Practise the rest": a new session with the same settings, made of the questions the
// student left unanswered in an earlier session, in their original order. No new question
// selection; questions deactivated since are left out. The free-tier rules apply as at start.
export async function POST(req: Request) {
  const { sessionId } = await req.json()
  if (!sessionId) return Response.json({ error: 'Missing sessionId' }, { status: 400 })

  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data: from } = await supabase.from('sessions').select('*').eq('id', sessionId).maybeSingle()
  if (!from || from.user_id !== user.id) return Response.json({ error: 'Not found' }, { status: 404 })

  const [{ data: answers, error: answersError }, { data: active, error: activeError }] = await Promise.all([
    supabase.from('session_answers').select('question_id').eq('session_id', sessionId),
    supabase.from('questions').select('id').in('id', from.question_ids).eq('active', true),
  ])
  if (answersError || activeError) return Response.json({ error: (answersError ?? activeError)!.message }, { status: 500 })
  const answered = new Set(answers.map(a => a.question_id))
  const activeIds = new Set(active.map(q => q.id))
  const rest = (from.question_ids as string[]).filter(id => !answered.has(id) && activeIds.has(id))
  if (rest.length === 0) return Response.json({ error: 'No unanswered questions left' }, { status: 400 })

  const { data: profile } = await supabase
    .from('profiles').select('subscription_tier, subscription_expires_at').eq('id', user.id).single()
  const subscribed = user.user_metadata?.is_admin === true || isSubscribed(profile as Parameters<typeof isSubscribed>[0])
  if (!subscribed) {
    const blocked = freeTierError({ scope: from.scope, questionCount: rest.length, mode: from.mode })
    if (blocked) return Response.json({ error: blocked }, { status: 403 })
  }

  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      user_id: user.id,
      subject_id: from.subject_id,
      licence_type: from.licence_type,
      scope: from.scope,
      topic_id: from.topic_id,
      source_book_id: from.source_book_id,
      chapter_id: from.chapter_id,
      mode: from.mode,
      difficulty: from.difficulty,
      question_count: rest.length,
      // The same time per question as the original
      time_limit_secs: Math.round((from.time_limit_secs ?? from.question_ids.length * 45) * rest.length / from.question_ids.length),
      question_ids: rest,
      composite_subjects: from.composite_subjects,
    })
    .select('id')
    .single()
  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ sessionId: session.id, questionCount: rest.length })
}
