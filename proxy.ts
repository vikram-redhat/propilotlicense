import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const bypassSecret = process.env.ADMIN_BYPASS_SECRET

  // Handle bypass URL directly in proxy — avoids route handler timing issues
  if (pathname === '/auth/bypass') {
    const secret = request.nextUrl.searchParams.get('secret')
    if (bypassSecret && secret === bypassSecret) {
      const response = NextResponse.redirect(new URL('/admin', request.url))
      response.cookies.set('admin_bypass', bypassSecret, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8,
      })
      return response
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const isAuthRoute = pathname === '/login' || pathname === '/verify' || pathname.startsWith('/auth/')
  const isPublicRoute = pathname === '/' || pathname === '/terms'

  const bypassCookie = request.cookies.get('admin_bypass')?.value
  const hasBypass = !!bypassSecret && bypassCookie === bypassSecret

  if (!user && !isAuthRoute && !isPublicRoute && !hasBypass) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (pathname.startsWith('/admin')) {
    const isAdmin = user?.user_metadata?.is_admin === true
    if (!isAdmin && !hasBypass) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|ico)$).*)'],
}
