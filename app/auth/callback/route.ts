import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')
  const type = searchParams.get('type')
  const isReset = type === 'recovery' || request.cookies.get('password_reset_pending')?.value === '1'
  const redirectTo = isReset ? '/reset-password' : (next?.startsWith('/') ? next : '/')

  const response = NextResponse.redirect(new URL(redirectTo, origin))
  // Clear the reset cookie regardless of which path we took
  if (isReset) response.cookies.set('password_reset_pending', '', { maxAge: 0, path: '/' })

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  return response
}
