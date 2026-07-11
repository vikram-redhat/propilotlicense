import { createAuthClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user?.user_metadata?.is_admin) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const supabase = createServiceClient()

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, exam_type, exam_type_set_at, subscription_tier, subscription_plan, subscription_expires_at, created_at')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  // Session count per student. Paged because a bulk select caps at 1000 rows by default,
  // which would silently undercount once there are more than 1000 sessions in total.
  const counts = new Map<string, number>()
  const PAGE = 1000
  for (let from = 0; ; from += PAGE) {
    const { data: rows, error: sErr } = await supabase
      .from('sessions')
      .select('user_id')
      .not('user_id', 'is', null)
      .range(from, from + PAGE - 1)
    if (sErr) return Response.json({ error: sErr.message }, { status: 500 })
    for (const row of rows ?? []) counts.set(row.user_id, (counts.get(row.user_id) ?? 0) + 1)
    if (!rows || rows.length < PAGE) break
  }

  const students = (profiles ?? []).map(p => ({ ...p, session_count: counts.get(p.id) ?? 0 }))

  return Response.json({ students })
}
