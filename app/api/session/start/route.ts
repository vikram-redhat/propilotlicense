import { createServiceClient } from '@/lib/supabase'

const weights = {
  all:    { easy: 1,   medium: 1,   hard: 1   },
  easy:   { easy: 0.7, medium: 0.3, hard: 0   },
  medium: { easy: 0.2, medium: 0.6, hard: 0.2 },
  hard:   { easy: 0.1, medium: 0.3, hard: 0.6 },
}

export async function POST(req: Request) {
  const { subjectId, mode, difficulty, questionCount, topicIds } = await req.json()

  if (!subjectId || !mode || !difficulty || !questionCount) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createServiceClient()

  let query = supabase
    .from('questions')
    .select('id, difficulty')
    .eq('subject_id', subjectId)
    .eq('active', true)

  if (topicIds && topicIds.length > 0) {
    // Include questions assigned to selected topics OR unassigned (topic_id is null)
    query = query.or(`topic_id.in.(${topicIds.join(',')}),topic_id.is.null`)
  }

  const { data: questions, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  if (!questions || questions.length === 0) {
    return Response.json({ error: 'No questions available for this configuration' }, { status: 400 })
  }

  // Weight and sample questions by difficulty
  const w = weights[difficulty as keyof typeof weights] || weights.all
  const weighted: string[] = []

  for (const q of questions) {
    const qDiff = q.difficulty as 'easy' | 'medium' | 'hard'
    const weight = w[qDiff] ?? 1
    if (weight > 0 && Math.random() < weight) {
      weighted.push(q.id)
    }
  }

  // If weighted selection is too small, fall back to all
  const pool = weighted.length >= Math.min(questionCount, questions.length)
    ? weighted
    : questions.map(q => q.id)

  // Shuffle and limit
  const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, questionCount)

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      subject_id: subjectId,
      mode,
      difficulty,
      question_ids: shuffled,
    })
    .select('id')
    .single()

  if (sessionError) {
    return Response.json({ error: sessionError.message }, { status: 500 })
  }

  return Response.json({ sessionId: session.id })
}
