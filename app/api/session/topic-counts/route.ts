import { createServiceClient } from '@/lib/supabase'
import { createAuthClient } from '@/lib/supabase-server'

// Active questions per topic of a subject, as a topic session draws them
// (/api/session/start: active, this subject, this topic). For the practice picker, which
// can't count them itself: students can read only their own sessions' questions.
// GET ?subjectId=… → { counts: { [topicId]: number } }
export async function GET(req: Request) {
  const subjectId = new URL(req.url).searchParams.get('subjectId')
  if (!subjectId) return Response.json({ error: 'Missing subjectId' }, { status: 400 })

  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data: topics, error } = await supabase.from('topics').select('id').eq('subject_id', subjectId)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  const results = await Promise.all((topics ?? []).map(t =>
    supabase.from('questions').select('id', { count: 'exact', head: true })
      .eq('active', true).eq('subject_id', subjectId).eq('topic_id', t.id)))
  const failed = results.find(r => r.error)
  if (failed) return Response.json({ error: failed.error!.message }, { status: 500 })
  return Response.json({ counts: Object.fromEntries((topics ?? []).map((t, i) => [t.id, results[i].count ?? 0])) })
}
