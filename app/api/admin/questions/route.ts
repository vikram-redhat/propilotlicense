import { createServiceClient } from '@/lib/supabase'

const PAGE_SIZE = 20

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const subject = searchParams.get('subject') || ''
  const status = searchParams.get('status') || 'all'
  const source = searchParams.get('source') || 'all'
  const citation = searchParams.get('citation') || 'all'
  const page = parseInt(searchParams.get('page') || '0', 10)

  const supabase = createServiceClient()

  // Questions list
  let query = supabase
    .from('questions')
    .select('*, subject:subjects(name,code), topic:topics(name), source_book:source_books(title,author)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

  if (subject) query = query.eq('subject_id', subject)
  if (status === 'published') query = query.eq('active', true)
  if (status === 'pending') query = query.eq('active', false).eq('flagged', false)
  if (status === 'flagged') query = query.eq('flagged', true)
  if (source === 'manual') query = query.eq('source_type', 'manual')
  if (source === 'ai') query = query.eq('source_type', 'ai')
  if (citation === 'verified') query = query.eq('citation_verified', true)
  if (citation === 'approx') query = query.eq('citation_verified', false).not('source_book_id', 'is', null)

  const { data: questions, count, error } = await query
  if (error) return Response.json({ error: error.message }, { status: 500 })

  // Stats (parallel)
  const opts = { count: 'exact' as const, head: true }
  const [total, pending, published, ai, citVerified, citTotal, subjectsRes] = await Promise.all([
    supabase.from('questions').select('*', opts),
    supabase.from('questions').select('*', opts).eq('active', false).eq('flagged', false),
    supabase.from('questions').select('*', opts).eq('active', true),
    supabase.from('questions').select('*', opts).eq('source_type', 'ai'),
    supabase.from('questions').select('*', opts).eq('citation_verified', true).not('source_book_id', 'is', null),
    supabase.from('questions').select('*', opts).not('source_book_id', 'is', null),
    supabase.from('subjects').select('*').order('sort_order'),
  ])

  return Response.json({
    questions: questions || [],
    total: count ?? 0,
    stats: {
      total: total.count ?? 0,
      pending: pending.count ?? 0,
      published: published.count ?? 0,
      ai: ai.count ?? 0,
      citVerified: citVerified.count ?? 0,
      citTotal: citTotal.count ?? 0,
    },
    subjects: subjectsRes.data || [],
  })
}
