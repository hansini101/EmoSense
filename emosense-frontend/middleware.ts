import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/admin-login', '/register', '/forgot-password']
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/(auth)')

  // Get auth token from cookies
  const token = request.cookies.get('auth_token')?.value

  // If trying to access protected route without token, redirect to login
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If authenticated user tries to access login/register (but NOT admin-login), redirect to dashboard
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
