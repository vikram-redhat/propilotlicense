import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const bypassSecret = process.env.ADMIN_BYPASS_SECRET

  if (!bypassSecret || !secret || secret !== bypassSecret) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const response = NextResponse.redirect(new URL('/admin', request.url))
  response.cookies.set('admin_bypass', bypassSecret, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
  })
  return response
}
