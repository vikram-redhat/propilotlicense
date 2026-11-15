import { createServiceClient } from '@/lib/supabase'

export type ContinueSession = { id: string; label: string; answered: number; total: number; mode: string }

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

// The student's most recent session, if it's unfinished: not ended, started under 7 days
// ago, at least one question answered and some left. Only the most recent session counts —
// an older unfinished one never shows. Null until scripts/migrate_session_end.sql is run
// (without sessions.ended_at an ended session can't be told from an unfinished one).
// A free chapter taster resumes like any session: only a new session on that chapter is
// blocked (lib/chapter-taster.ts).
export async function getContinueSession(userId: string): Promise<ContinueSession | null> {
  const supabase = createServiceClient()
  const { data: s } = await supabase
    .from('sessions').select('*').eq('user_id', userId)
    .order('created_at', { ascending: false }).limit(1).maybeSingle()
  if (!s || !('ended_at' in s) || s.ended_at) return null
  if (Date.now() - new Date(s.created_at).getTime() > MAX_AGE_MS) return null

  const { count } = await supabase.from('session_answers').select('id', { count: 'exact', head: true }).eq('session_id', s.id)
  const answered = count ?? 0
  const total = s.question_ids.length
  if (answered === 0 || answered >= total) return null

  // "Air Regulations, R.K. Bali chapter 2"
  const [subject, book, chapter, topic] = await Promise.all([
    s.subject_id && s.scope !== 'composite' && s.scope !== 'nav_rai_combined'
      ? supabase.from('subjects').select('name').eq('id', s.subject_id).maybeSingle().then(r => r.data?.name) : undefined,
    s.source_book_id
      ? supabase.from('source_books').select('title, author').eq('id', s.source_book_id).maybeSingle().then(r => r.data && (r.data.author || r.data.title)) : undefined,
    s.chapter_id
      ? supabase.from('chapters').select('chapter_number').eq('id', s.chapter_id).maybeSingle().then(r => r.data?.chapter_number) : undefined,
    s.topic_id
      ? supabase.from('topics').select('name').eq('id', s.topic_id).maybeSingle().then(r => r.data?.name) : undefined,
  ])
  const name =
    s.scope === 'composite' ? 'Composite Paper' :
    s.scope === 'nav_rai_combined' ? 'Air Navigation + Radio Aids' :
    subject ?? 'Practice session'
  const detail =
    s.scope === 'book_chapter' && book ? `${book}${chapter ? ` chapter ${chapter}` : ''}` :
    s.scope === 'book' ? book :
    s.scope === 'topic' ? topic :
    undefined

  return { id: s.id, label: detail ? `${name}, ${detail}` : name, answered, total, mode: s.mode }
}
