import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isProtectedPage = pathname.startsWith('/dashboard')

  const token = request.cookies.get('auth-token')?.value
  // In Edge middleware, Node JWT libraries are not supported. Treat presence of token as authenticated.
  const isAuthenticated = Boolean(token)

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Redirect unauthenticated users away from protected pages
  if (isProtectedPage && !isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}


export const config = {
  matcher: ['/login', '/register', '/dashboard', '/dashboard/:path*'],
}
