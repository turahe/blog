import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, PROTECTED_PREFIXES } from '@/lib/auth/constants'

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isProtected(pathname)) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value

  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/settings/:path*'],
}
