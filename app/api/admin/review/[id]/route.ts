import { createServiceClient } from '@/lib/supabase'
import { createAuthClient } from '@/lib/supabase-server'
import { isAdminRequest } from '@/lib/admin-auth'

// Stamp a question as reviewed now, by the current admin (null in bypass mode, which
// has no Supabase session).
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params

  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()

  const reviewedAt = new Date().toISOString()
  const { error } = await createServiceClient()
    .from('questions')
    .update({ last_reviewed_at: reviewedAt, last_reviewed_by: user?.id ?? null })
    .eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ ok: true, last_reviewed_at: reviewedAt })
}
