import { createAuthClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(request: Request) {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { questionId, reason } = await request.json()
  if (!questionId) return Response.json({ error: 'questionId required' }, { status: 400 })

  const svc = createServiceClient()

  // Record the flag from this user
  await svc.from('question_flags').insert({ question_id: questionId, user_id: user.id, reason: reason ?? null })

  // Mark the question as flagged so it surfaces in the admin question bank
  await svc.from('questions').update({ flagged: true }).eq('id', questionId)

  return Response.json({ ok: true })
}
