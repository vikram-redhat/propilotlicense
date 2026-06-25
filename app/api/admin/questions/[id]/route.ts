import { createServiceClient } from '@/lib/supabase'
import { isAdminRequest } from '@/lib/admin-auth'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json()
  const supabase = createServiceClient()
  const { error } = await supabase.from('questions').update(body).eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
