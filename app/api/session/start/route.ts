import { createServiceClient } from '@/lib/supabase'

const weights = {
  all:    { easy: 1,   medium: 1,   hard: 1   },
  easy:   { easy: 0.7, medium: 0.3, hard: 0   },
  medium: { easy: 0.2, medium: 0.6, hard: 0.2 },
  hard:   { easy: 0.1, medium: 0.3, hard: 0.6 },
}

export async function POST(req: Request) {
  const { subjectId, licenceType, scope, topicId, sourceBookId, mode, difficulty, questionCount } = await req.json()

  if (!subjectId || !mode || !difficulty || !questionCount || !scope) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (![50, 100].includes(questionCount)) {
    return Response.json({ error: 'Question count must be 50 or 100' }, { status: 400 })
  }

  const supabase = createServiceClient()

  let query = supabase
    .from('questions')
    .select('id, difficulty')
    .eq('subject_id', subjectId)
    .eq('active', true)

  if (scope === 'topic' && topicId) {
    query = query.eq('topic_id', topicId)
  } else if (scope === 'book' && sourceBookId) {
    query = query.eq('source_book_id', sourceBookId)
  } else if (scope === 'book_topic' && sourceBookId && topicId) {
    query = query.eq('source_book_id', sourceBookId).eq('topic_id', topicId)
  }
  // scope === 'combined': no additional filter

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
    const qDiff = q.difficulty as 'easy' | 'medium' | 'hard'
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
      subject_id: subjectId,
      licence_type: (licenceType || 'CPL').toUpperCase(),
      scope,
      topic_id: (scope === 'topic' || scope === 'book_topic') ? (topicId ?? null) : null,
      source_book_id: (scope === 'book' || scope === 'book_topic') ? (sourceBookId ?? null) : null,
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
