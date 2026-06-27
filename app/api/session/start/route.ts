import { createServiceClient } from '@/lib/supabase'
import { createAuthClient } from '@/lib/supabase-server'
import { isSubscribed } from '@/lib/subscription'

const weights = {
  all:      { basic: 1,   advanced: 1   },
  basic:    { basic: 0.8, advanced: 0.2 },
  advanced: { basic: 0.2, advanced: 0.8 },
}

export async function POST(req: Request) {
  const { subjectId, licenceType, scope, topicId, sourceBookId, chapterId, mode, difficulty, questionCount } = await req.json()

  if (!subjectId || !mode || !difficulty || !questionCount || !scope) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (![10, 50, 100].includes(questionCount)) {
    return Response.json({ error: 'Invalid question count' }, { status: 400 })
  }

  // Get current user from auth cookies
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // Server-side subscription enforcement
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_expires_at')
    .eq('id', user.id)
    .single()

  const subscribed = isSubscribed(profile as Parameters<typeof isSubscribed>[0])

  if (!subscribed) {
    if (scope !== 'combined') return Response.json({ error: 'free_tier_scope' }, { status: 403 })
    if (questionCount > 10)   return Response.json({ error: 'free_tier_count' }, { status: 403 })
    if (mode === 'mock')      return Response.json({ error: 'free_tier_mode' },  { status: 403 })
  }

  let query = supabase
    .from('questions')
    .select('id, difficulty')
    .eq('subject_id', subjectId)
    .eq('active', true)

  switch (scope) {
    case 'topic':
      query = query.is('source_book_id', null)
      if (topicId) query = query.eq('topic_id', topicId)
      break
    case 'book':
      query = query.eq('source_book_id', sourceBookId)
      break
    case 'book_chapter':
      query = query.eq('source_book_id', sourceBookId)
      if (chapterId) query = query.eq('chapter_id', chapterId)
      break
    case 'combined':
      query = query.is('source_book_id', null)
      break
  }

  const { data: questions, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  if (!questions || questions.length === 0) {
    return Response.json({ error: 'No questions available for this configuration' }, { status: 400 })
  }

  const w = weights[difficulty as keyof typeof weights] || weights.all
  const weighted: string[] = []

  for (const q of questions) {
    const qDiff = q.difficulty as 'basic' | 'advanced'
    const weight = w[qDiff] ?? 1
    if (weight > 0 && Math.random() < weight) {
      weighted.push(q.id)
    }
  }

  const pool = weighted.length >= Math.min(questionCount, questions.length)
    ? weighted
    : questions.map(q => q.id)

  const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, questionCount)

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      user_id: user.id,
      subject_id: subjectId,
      licence_type: (licenceType || 'CPL').toUpperCase(),
      scope,
      topic_id: scope === 'topic' ? (topicId ?? null) : null,
      source_book_id: (scope === 'book' || scope === 'book_chapter') ? (sourceBookId ?? null) : null,
      chapter_id: scope === 'book_chapter' ? (chapterId ?? null) : null,
      mode,
      difficulty,
      question_count: questionCount,
      time_limit_secs: questionCount * 45,
      question_ids: shuffled,
    })
    .select('id')
    .single()

  if (sessionError) {
    return Response.json({ error: sessionError.message }, { status: 500 })
  }

  return Response.json({ sessionId: session.id })
}
