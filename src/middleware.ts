import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedPage = pathname.startsWith('/trips') || pathname.startsWith('/dashboard')
  const isAuthPage = pathname === '/login' || pathname === '/register'

  const token = request.cookies.get('auth-token')?.value
  // In Edge middleware, Node JWT libraries are not supported. Use a conservative presence check.
  const isAuthenticated = Boolean(token && token !== 'undefined' && token !== 'null')

  // Redirect unauthenticated users away from protected pages
  if (isProtectedPage && !isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/trips'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register', '/trips', '/trips/:path*', '/dashboard', '/dashboard/:path*'],
}
