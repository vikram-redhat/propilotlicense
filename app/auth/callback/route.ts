import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest, after } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { sendWelcomeEmail } from '@/lib/email'
import { hubForExamType } from '@/lib/hub'

// Best-effort welcome email on a user's first confirmed sign-in (email confirmation or
// OAuth). Idempotent via profiles.welcome_email_sent_at, so it sends exactly once and
// never on password-reset callbacks. Runs after the redirect response — never blocks it.
async function maybeSendWelcome(userId: string, email: string, name: string | null) {
  try {
    const svc = createServiceClient()

    // Claim the send atomically: stamp the flag only if it's still null, and treat the
    // updated-row count as "we won the claim". This also prevents a double send if the
    // callback runs twice concurrently.
    //
    // The profiles row is created by the handle_new_user trigger. On an OAuth signup the
    // user is created during THIS request, so the row can lag by a few ms — retry instead
    // of giving up, which is what previously caused OAuth signups to silently get no
    // welcome email. We're inside after(), so the wait costs the user nothing.
    let claimed = false
    for (let attempt = 0; attempt < 5 && !claimed; attempt++) {
      const { data: rows, error } = await svc
        .from('profiles')
        .update({ welcome_email_sent_at: new Date().toISOString() })
        .eq('id', userId)
        .is('welcome_email_sent_at', null)
        .select('id')

      if (error) {
        console.error('[welcome] claim query failed:', error.message)
        return
      }
      if (rows && rows.length > 0) {
        claimed = true
        break
      }

      // Nothing updated: either already sent, or the profile row doesn't exist yet.
      const { data: existing } = await svc
        .from('profiles')
        .select('welcome_email_sent_at')
        .eq('id', userId)
        .maybeSingle()
      if (existing) return // row is there and already stamped — nothing to do
      await new Promise(r => setTimeout(r, 300))
    }

    if (!claimed) {
      console.error('[welcome] profile row never appeared for', userId, '— no email sent')
      return
    }

    const sent = await sendWelcomeEmail({ to: email, name })
    if (!sent) {
      // Release the claim so a later sign-in retries rather than being stamped as sent.
      await svc.from('profiles').update({ welcome_email_sent_at: null }).eq('id', userId)
      console.error('[welcome] send failed for', userId, '— claim released for retry')
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
      if (needsSetup) {
        response.headers.set('location', new URL('/profile/setup', origin).toString())
      } else if (redirectTo === '/cpl' || redirectTo === '/atpl') {
        // A generic licence-hub `next` may not match the user's exam type — send
        // ATPL users to /atpl instead of the hardcoded /cpl.
        response.headers.set('location', new URL(hubForExamType(user.user_metadata?.exam_type as string | undefined), origin).toString())
      }

      const name = (user.user_metadata?.full_name as string | undefined) ?? user.email?.split('@')[0] ?? null
      after(() => maybeSendWelcome(user.id, user.email!, name))
    }
  }

  return response
}
