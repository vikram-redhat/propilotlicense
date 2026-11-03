import { createServiceClient } from '@/lib/supabase'
import { isAdminRequest } from '@/lib/admin-auth'

const BATCH_SIZE = 20

type BatchRow = {
  id: string
  last_reviewed_by: string | null
  options: { option_letter: string; option_text: string; is_correct: boolean }[] | null
  [key: string]: unknown
}

// Review batch: the next BATCH_SIZE questions matching the filters, never-reviewed first,
// then least-recently reviewed. Each question comes with everything a reviewer needs on
// one card — options, source, flags (with reasons) and how students have done on it.
export async function GET(request: Request) {
  if (!await isAdminRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  const subject = searchParams.get('subject') || ''
  const book    = searchParams.get('book') || ''
  const chapter = searchParams.get('chapter') || ''
  const status  = searchParams.get('status') || 'published'
  const exclude = (searchParams.get('exclude') || '').split(',').filter(Boolean)

  const supabase = createServiceClient()

  // Same filters for the batch and both progress counts. Typed loosely: the supabase
  // builder's generics recurse too deep for TS when abstracted over.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const applyFilters = (q: any) => {
    if (subject) q = q.eq('subject_id', subject)
    if (book)    q = q.eq('source_book_id', book)
    if (chapter) q = q.eq('chapter_id', chapter)
    if (status === 'published') q = q.eq('active', true)
    if (status === 'draft')     q = q.eq('active', false)
    if (status === 'flagged')   q = q.eq('flagged', true)
    return q
  }

  const BATCH_SELECT = '*, options:question_options(option_letter,option_text,is_correct), subject:subjects(name,code), topic:topics(name), source_book:source_books(title,author), chapter:chapters!chapter_id(chapter_number,chapter_name)'

  // Batch order comes from the review_batch RPC (scripts/migrate_review_order.sql), which
  // ranks never-reviewed questions by how often students get them wrong — stats need to
  // be computed before the limit, so it can't be done with PostgREST ordering.
  let rows: BatchRow[] | null = null
  let error: { code?: string; message: string } | null = null
  const { data: ranked, error: rpcError } = await supabase.rpc('review_batch', {
    p_subject: subject || null,
    p_book:    book || null,
    p_chapter: chapter || null,
    p_status:  status,
    p_exclude: exclude,
    p_limit:   BATCH_SIZE,
  })

  if (!rpcError) {
    const order = new Map((ranked as { id: string }[]).map((r, i) => [r.id, i]))
    const res = order.size
      ? await supabase.from('questions').select(BATCH_SELECT).in('id', [...order.keys()])
      : { data: [], error: null }
    rows = ((res.data ?? []) as BatchRow[]).sort((a, b) => order.get(a.id)! - order.get(b.id)!)
    error = res.error
  } else if (rpcError.code === 'PGRST202') {
    // Function not created yet — fall back to plain least-recently-reviewed ordering.
    let batchQuery = applyFilters(supabase.from('questions').select(BATCH_SELECT))
    if (exclude.length) batchQuery = batchQuery.not('id', 'in', `(${exclude.join(',')})`)
    const res = await batchQuery
      .order('last_reviewed_at', { ascending: true, nullsFirst: true })
      .order('created_at', { ascending: true })
      .limit(BATCH_SIZE)
    rows = res.data
    error = res.error
  } else {
    error = rpcError
  }

  if (error) {
    // 42703 = undefined column: the review migration hasn't been run yet.
    if (error.code === '42703' || /last_reviewed_at/.test(error.message)) {
      return Response.json({ error: 'migration', message: 'Run scripts/migrate_question_review.sql in the Supabase SQL editor to enable review mode.' }, { status: 409 })
    }
    return Response.json({ error: error.message }, { status: 500 })
  }

  const questions = (rows ?? []) as BatchRow[]
  const ids = questions.map(q => q.id)
  const head = { count: 'exact' as const, head: true }

  let booksQuery = supabase.from('source_books').select('id, title, author').order('sort_order')
  if (subject) booksQuery = booksQuery.eq('subject_id', subject)

  const [subjectsRes, booksRes, chaptersRes] = await Promise.all([
    supabase.from('subjects').select('id, name').order('sort_order'),
    booksQuery,
    book
      ? supabase.from('chapters').select('id, chapter_number, chapter_name').eq('book_id', book).order('sort_order')
      : Promise.resolve({ data: [] as { id: string; chapter_number: number; chapter_name: string }[] }),
  ])

  const [flagsRes, answers, totalRes, neverRes, reviewerIds] = await Promise.all([
    ids.length
      ? supabase.from('question_flags').select('question_id, reason, resolved, created_at').in('question_id', ids).order('created_at', { ascending: false })
      : Promise.resolve({ data: [] as { question_id: string; reason: string | null; resolved: boolean; created_at: string }[] }),
    fetchAnswers(supabase, ids),
    applyFilters(supabase.from('questions').select('id', head)),
    applyFilters(supabase.from('questions').select('id', head)).is('last_reviewed_at', null),
    Promise.resolve([...new Set(questions.map(q => q.last_reviewed_by).filter(Boolean))] as string[]),
  ])

  const { data: reviewers } = reviewerIds.length
    ? await supabase.from('profiles').select('id, full_name, email').in('id', reviewerIds)
    : { data: [] as { id: string; full_name: string | null; email: string | null }[] }
  const reviewerName = new Map((reviewers ?? []).map(r => [r.id, r.full_name || r.email || 'Admin']))

  const stats = new Map<string, { answered: number; correct: number; picks: Record<string, number> }>()
  for (const a of answers) {
    const s = stats.get(a.question_id) ?? { answered: 0, correct: 0, picks: {} }
    s.answered++
    if (a.is_correct) s.correct++
    if (a.option_letter) s.picks[a.option_letter] = (s.picks[a.option_letter] ?? 0) + 1
    stats.set(a.question_id, s)
  }

  const enriched = questions.map(q => ({
    ...q,
    options: [...(q.options ?? [])].sort((a, b) => a.option_letter.localeCompare(b.option_letter)),
    flags: (flagsRes.data ?? []).filter(f => f.question_id === q.id),
    answer_stats: stats.get(q.id) ?? { answered: 0, correct: 0, picks: {} },
    last_reviewed_by_name: q.last_reviewed_by ? reviewerName.get(q.last_reviewed_by) ?? 'Admin' : null,
  }))

  return Response.json({
    questions: enriched,
    progress: { total: totalRes.count ?? 0, neverReviewed: neverRes.count ?? 0 },
    subjects: subjectsRes.data ?? [],
    books: booksRes.data ?? [],
    chapters: chaptersRes.data ?? [],
  })
}

// session_answers for the batch, with the letter each student picked. Paged — a bulk
// select caps at 1000 rows.
async function fetchAnswers(supabase: ReturnType<typeof createServiceClient>, ids: string[]) {
  const rows: { question_id: string; is_correct: boolean; option_letter: string | null }[] = []
  if (!ids.length) return rows
  const PAGE = 1000
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('session_answers')
      .select('question_id, is_correct, selected:question_options!selected_option_id(option_letter)')
      .in('question_id', ids)
      .order('id')
      .range(from, from + PAGE - 1)
    if (error || !data) break
    for (const r of data as unknown as { question_id: string; is_correct: boolean; selected: { option_letter: string } | null }[]) {
      rows.push({ question_id: r.question_id, is_correct: r.is_correct, option_letter: r.selected?.option_letter ?? null })
    }
    if (data.length < PAGE) break
  }
  return rows
}
