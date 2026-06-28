import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PREFIXES = ['/_next', '/favicon.ico', '/hero', '/auth']
const PUBLIC_PATHS = ['/', '/login', '/signup', '/terms', '/pricing']

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Never intercept static assets or auth callback
  if (PUBLIC_PREFIXES.some(p => path.startsWith(p))) return NextResponse.next()

  // Profile setup page itself must always be reachable
  if (path.startsWith('/profile/setup')) return NextResponse.next()

  const isPublic = PUBLIC_PATHS.includes(path)

  let res = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value)
            res = NextResponse.next({ request: req })
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Unauthenticated users can only access public paths
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(path)}`, req.url))
  }

  // Authenticated users with no exam_type must complete profile setup
  if (user && !isPublic && !user.user_metadata?.exam_type) {
    return NextResponse.redirect(new URL('/profile/setup', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)'],
}
