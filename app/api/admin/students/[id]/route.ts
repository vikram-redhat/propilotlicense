import { createAuthClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user?.user_metadata?.is_admin) return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const { id } = await params
  const supabase = createServiceClient()

  const [sessionsRes, answersRes] = await Promise.all([
    supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('user_id', id),
    supabase.from('session_answers')
      .select('is_correct, session:sessions!inner(user_id)')
      .eq('session.user_id', id),
  ])

  const answers = answersRes.data ?? []
  const correct = answers.filter(a => a.is_correct).length

  return Response.json({
    sessions: sessionsRes.count ?? 0,
    questions_answered: answers.length,
    correct_answers: correct,
  })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user?.user_metadata?.is_admin) return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const supabase = createServiceClient()

  const profileUpdate: Record<string, unknown> = {}
  if ('exam_type' in body)              profileUpdate.exam_type = body.exam_type
  if ('exam_type_set_at' in body)       profileUpdate.exam_type_set_at = body.exam_type_set_at
  if ('subscription_tier' in body)      profileUpdate.subscription_tier = body.subscription_tier
  if ('subscription_plan' in body)      profileUpdate.subscription_plan = body.subscription_plan
  if ('subscription_expires_at' in body) profileUpdate.subscription_expires_at = body.subscription_expires_at

  if (Object.keys(profileUpdate).length > 0) {
    const { error } = await supabase.from('profiles').update(profileUpdate).eq('id', id)
    if (error) return Response.json({ error: error.message }, { status: 500 })
  }

  // Sync exam_type change to auth user metadata so the proxy sees it immediately
  if ('exam_type' in body) {
    await supabase.auth.admin.updateUserById(id, {
      user_metadata: { exam_type: body.exam_type ?? null },
    })
  }

  return Response.json({ success: true })
}
