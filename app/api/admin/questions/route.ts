import { createServiceClient } from '@/lib/supabase'
import { isAdminRequest } from '@/lib/admin-auth'

const PAGE_SIZE = 20

export async function GET(request: Request) {
  if (!await isAdminRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  const subject    = searchParams.get('subject') || ''
  const book       = searchParams.get('book') || ''
  const chapter    = searchParams.get('chapter') || ''
  const topic      = searchParams.get('topic') || ''
  const difficulty = searchParams.get('difficulty') || ''
  const status     = searchParams.get('status') || 'all'
  const source     = searchParams.get('source') || 'all'
  const citation   = searchParams.get('citation') || 'all'
  const sort       = searchParams.get('sort') || 'newest'
  const page       = parseInt(searchParams.get('page') || '0', 10)

  const supabase = createServiceClient()

  // Questions list
  let query = supabase
    .from('questions')
    .select(
      '*, subject:subjects(name,code), topic:topics(name), source_book:source_books(title,author), chapter:chapters(chapter_number,chapter_name)',
      { count: 'exact' }
    )
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

  if (subject)    query = query.eq('subject_id', subject)
  if (book)       query = query.eq('source_book_id', book)
  if (chapter)    query = query.eq('chapter_id', chapter)
  if (topic)      query = query.eq('topic_id', topic)
  if (difficulty) query = query.eq('difficulty', difficulty)
  if (status === 'published') query = query.eq('active', true)
  if (status === 'pending')   query = query.eq('active', false).eq('flagged', false)
  if (status === 'flagged')   query = query.eq('flagged', true)
  if (source === 'manual') query = query.eq('source_type', 'manual')
  if (source === 'ai')     query = query.eq('source_type', 'ai')
  if (citation === 'verified') query = query.eq('citation_verified', true)
  if (citation === 'approx')   query = query.eq('citation_verified', false).not('source_book_id', 'is', null)

  switch (sort) {
    case 'oldest':        query = query.order('created_at', { ascending: true }); break
    case 'basic-first':   query = query.order('difficulty', { ascending: false }); break
    case 'advanced-first':query = query.order('difficulty', { ascending: true }); break
    case 'alpha':         query = query.order('question_text', { ascending: true }); break
    default:              query = query.order('created_at', { ascending: false })
  }

  // Stats + dropdown data in parallel
  const opts = { count: 'exact' as const, head: true }

  let booksQuery = supabase.from('source_books').select('id, title, author').order('sort_order')
  if (subject) booksQuery = booksQuery.eq('subject_id', subject)

  let topicsQuery = supabase.from('topics').select('id, name').order('sort_order')
  if (subject) topicsQuery = topicsQuery.eq('subject_id', subject)

  let chaptersQuery = supabase.from('chapters').select('id, chapter_number, chapter_name').order('sort_order')
  if (book) chaptersQuery = chaptersQuery.eq('book_id', book)

  const [
    { data: questions, count, error },
    total, pending, published, ai, citVerified, citTotal,
    subjectsRes, booksRes, topicsRes, chaptersRes,
  ] = await Promise.all([
    query,
    supabase.from('questions').select('*', opts),
    supabase.from('questions').select('*', opts).eq('active', false).eq('flagged', false),
    supabase.from('questions').select('*', opts).eq('active', true),
    supabase.from('questions').select('*', opts).eq('source_type', 'ai'),
    supabase.from('questions').select('*', opts).eq('citation_verified', true).not('source_book_id', 'is', null),
    supabase.from('questions').select('*', opts).not('source_book_id', 'is', null),
    supabase.from('subjects').select('*').order('sort_order'),
    booksQuery,
    topicsQuery,
    book ? chaptersQuery : Promise.resolve({ data: [] }),
  ])

  if (error) return Response.json({ error: error.message }, { status: 500 })

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
    books: booksRes.data || [],
    topics: topicsRes.data || [],
    chapters: chaptersRes.data || [],
  })
}
