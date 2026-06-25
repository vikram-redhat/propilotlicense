import { createAuthClient } from '@/lib/supabase-server'

export async function isAdminRequest(request: Request): Promise<boolean> {
  const bypassSecret = process.env.ADMIN_BYPASS_SECRET
  if (bypassSecret) {
    const cookies = request.headers.get('cookie') ?? ''
    const match = cookies.split(';').map(c => c.trim()).find(c => c.startsWith('admin_bypass='))
    if (match?.split('=')[1] === bypassSecret) return true
  }

  try {
    const supabase = await createAuthClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.user_metadata?.is_admin === true
  } catch {
    return false
  }
}
