import { createServiceClient } from '@/lib/supabase'
import { createAuthClient } from '@/lib/supabase-server'
import { isSubscribed } from '@/lib/subscription'
import { isVisibleForCountry } from '@/lib/countries'

const weights = {
  all:      { basic: 1,   advanced: 1   },
  basic:    { basic: 0.8, advanced: 0.2 },
  advanced: { basic: 0.2, advanced: 0.8 },
}

type CountryTaggedQuestion = {
  id: string
  difficulty: string
  source_book: { countries: string[] | null } | null
}

// Questions with no linked book (the common pool) are treated as universal —
// only questions tied to a book explicitly tagged to other countries are excluded.
// See lib/countries.ts's isVisibleForCountry for the shared rule (also used by the
// book picker at app/[licence]/[subjectId]/page.tsx).
function filterByCountry<T extends CountryTaggedQuestion>(rows: T[], country: string | null): T[] {
  return rows.filter(q => isVisibleForCountry(q.source_book?.countries, country))
}

export async function POST(req: Request) {
  const { subjectId, licenceType, scope, topicId, sourceBookId, chapterId, mode, difficulty, questionCount, pairedSubjectId } = await req.json()

  if (!scope || !mode || !difficulty) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (scope !== 'composite' && !subjectId) {
    return Response.json({ error: 'Missing subjectId' }, { status: 400 })
  }
  if (scope !== 'composite' && !questionCount) {
    return Response.json({ error: 'Missing questionCount' }, { status: 400 })
  }
  if (scope !== 'composite' && ![10, 50, 100].includes(questionCount)) {
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
    .select('subscription_tier, subscription_expires_at, country')
    .eq('id', user.id)
    .single()

  const studentCountry = profile?.country ?? null
  const isAdmin    = user.user_metadata?.is_admin === true
  const subscribed = isAdmin || isSubscribed(profile as Parameters<typeof isSubscribed>[0])

  if (!subscribed) {
    if (scope !== 'combined') return Response.json({ error: 'free_tier_scope' }, { status: 403 })
    if (questionCount > 10)   return Response.json({ error: 'free_tier_count' }, { status: 403 })
    if (mode === 'mock')      return Response.json({ error: 'free_tier_mode' },  { status: 403 })
  }

  // nav_rai_combined — 50 NAV + 50 RAI questions interleaved
  if (scope === 'nav_rai_combined') {
    if (!subscribed) return Response.json({ error: 'free_tier_mode' }, { status: 403 })
    if (!pairedSubjectId) return Response.json({ error: 'Missing pairedSubjectId' }, { status: 400 })

    const pickHalf = async (sid: string): Promise<string[]> => {
      const { data: rows } = await supabase
        .from('questions')
        .select('id, difficulty, source_book:source_books(countries)')
        .eq('subject_id', sid)
        .eq('active', true)
      const qs = filterByCountry((rows || []) as unknown as CountryTaggedQuestion[], studentCountry)
      if (qs.length === 0) return []
      const w = weights[difficulty as keyof typeof weights] || weights.all
      const weighted: string[] = []
      for (const q of qs) {
        const weight = w[q.difficulty as keyof typeof w] ?? 1
        if (weight > 0 && Math.random() < weight) weighted.push(q.id)
      }
      const pool = weighted.length >= 50 ? weighted : qs.map(q => q.id)
      return pool.sort(() => Math.random() - 0.5).slice(0, 50)
    }

    const [navIds, raiIds] = await Promise.all([pickHalf(subjectId), pickHalf(pairedSubjectId)])

    if (navIds.length === 0 || raiIds.length === 0) {
      return Response.json({ error: 'Not enough questions for combined paper' }, { status: 400 })
    }

    const interleaved: string[] = []
    for (let i = 0; i < Math.max(navIds.length, raiIds.length); i++) {
      if (i < navIds.length) interleaved.push(navIds[i])
      if (i < raiIds.length) interleaved.push(raiIds[i])
    }

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        subject_id: null,
        licence_type: (licenceType || 'CPL').toUpperCase(),
        scope: 'nav_rai_combined',
        mode: 'mock',
        difficulty,
        question_count: interleaved.length,
        time_limit_secs: 6000,
        question_ids: interleaved,
        composite_subjects: ['NAV', 'RAI'],
      })
      .select('id')
      .single()

    if (sessionError) return Response.json({ error: sessionError.message }, { status: 500 })
    return Response.json({ sessionId: session.id })
  }

  // composite — 34 from NAV+RAI, 33 from MET, 33 from REG, three-way interleaved
  if (scope === 'composite') {
    if (!subscribed) return Response.json({ error: 'free_tier_scope' }, { status: 403 })

    const { data: subjects } = await supabase
      .from('subjects')
      .select('id, code')
      .in('code', ['MET', 'NAV', 'RAI', 'REG'])

    const byCode: Record<string, string> = {}
    subjects?.forEach(s => { byCode[s.code] = s.id })

    const pickN = async (subjectIds: string[], n: number): Promise<string[]> => {
      const { data: rows } = await supabase
        .from('questions')
        .select('id, difficulty, source_book:source_books(countries)')
        .in('subject_id', subjectIds)
        .eq('active', true)
      const qs = filterByCountry((rows || []) as unknown as CountryTaggedQuestion[], studentCountry)
      if (qs.length === 0) return []
      const w = weights[difficulty as keyof typeof weights] || weights.all
      const weighted: string[] = []
      for (const q of qs) {
        const weight = w[q.difficulty as keyof typeof w] ?? 1
        if (weight > 0 && Math.random() < weight) weighted.push(q.id)
      }
      const pool = weighted.length >= n ? weighted : qs.map(q => q.id)
      return pool.sort(() => Math.random() - 0.5).slice(0, n)
    }

    const navRaiIds = [byCode['NAV'], byCode['RAI']].filter(Boolean)
    const [navRaiQs, metQs, regQs] = await Promise.all([
      pickN(navRaiIds, 34),
      pickN([byCode['MET']].filter(Boolean), 33),
      pickN([byCode['REG']].filter(Boolean), 33),
    ])

    if (navRaiQs.length === 0 && metQs.length === 0 && regQs.length === 0) {
      return Response.json({ error: 'No questions available for Composite paper' }, { status: 400 })
    }

    const interleaved: string[] = []
    for (let i = 0; i < Math.max(navRaiQs.length, metQs.length, regQs.length); i++) {
      if (i < navRaiQs.length) interleaved.push(navRaiQs[i])
      if (i < metQs.length) interleaved.push(metQs[i])
      if (i < regQs.length) interleaved.push(regQs[i])
    }

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        subject_id: null,
        licence_type: (licenceType || 'CPL').toUpperCase(),
        scope: 'composite',
        mode,
        difficulty,
        question_count: interleaved.length,
        time_limit_secs: 6000,
        question_ids: interleaved,
        composite_subjects: ['NAV', 'RAI', 'MET', 'REG'],
      })
      .select('id')
      .single()

    if (sessionError) return Response.json({ error: sessionError.message }, { status: 500 })
    return Response.json({ sessionId: session.id })
  }

  let query = supabase
    .from('questions')
    .select('id, difficulty, source_book:source_books(countries)')
    .eq('subject_id', subjectId)
    .eq('active', true)

  switch (scope) {
    case 'topic':
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
      // All active questions for the subject — no source_book_id filter
      break
  }

  const { data: rawQuestions, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const questions = filterByCountry((rawQuestions || []) as unknown as CountryTaggedQuestion[], studentCountry)

  if (questions.length === 0) {
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
