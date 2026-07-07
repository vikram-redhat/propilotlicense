import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

// Server-side client with user auth from cookies — respects RLS, for auth-aware API routes
export async function createAuthClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

// Shared header auth-state lookup for server-rendered public pages (About, Guides,
// Subjects, etc.) so LandingHeader reflects a real session instead of hardcoding
// isLoggedIn={false} — every public page must call this rather than assuming logged-out.
export async function getHeaderAuthState(): Promise<{ isLoggedIn: boolean; name: string | null }> {
  const supabase = await createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()
  const name = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? null
  return { isLoggedIn: !!user, name }
}
