import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest, after } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { sendWelcomeEmail } from '@/lib/email'

// Best-effort welcome email on a user's first confirmed sign-in (email confirmation or
// OAuth). Idempotent via profiles.welcome_email_sent_at, so it sends exactly once and
// never on password-reset callbacks. Runs after the redirect response — never blocks it.
async function maybeSendWelcome(userId: string, email: string, name: string | null) {
  try {
    const svc = createServiceClient()
    const { data, error } = await svc
      .from('profiles')
      .select('welcome_email_sent_at')
      .eq('id', userId)
      .single()
    if (error || !data || data.welcome_email_sent_at) return
    const sent = await sendWelcomeEmail({ to: email, name })
    if (sent) {
      await svc.from('profiles').update({ welcome_email_sent_at: new Date().toISOString() }).eq('id', userId)
    }
  } catch (e) {
    console.error('[auth/callback] welcome email error:', e)
  }
}

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
    const { data } = await supabase.auth.exchangeCodeForSession(code)
    const user = data?.user
    // Only for genuine sign-ins, never on password-reset callbacks.
    if (user && !isReset) {
      // First-time users land on a public page (home), which the proxy's setup gate
      // skips — so force them into profile setup here before anything else.
      const needsSetup = !user.user_metadata?.exam_type || !user.user_metadata?.country
      if (needsSetup) response.headers.set('location', new URL('/profile/setup', origin).toString())

      const name = (user.user_metadata?.full_name as string | undefined) ?? user.email?.split('@')[0] ?? null
      after(() => maybeSendWelcome(user.id, user.email!, name))
    }
  }

  return response
}
