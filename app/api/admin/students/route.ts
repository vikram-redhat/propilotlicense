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

  return Response.json({ students: profiles ?? [] })
}
