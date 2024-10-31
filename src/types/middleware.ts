import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  const pathname = req.nextUrl.pathname

  // Public routes - always accessible
  if (pathname === '/' || pathname.startsWith('/articles')) {
    return res
  }

  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (session) {
      return res
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Protected routes - require authentication
  if (pathname === '/dashboard' || pathname === '/articles/write') {
    if (!session) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return res
  }

  // Auth routes - redirect to dashboard if already authenticated
//   if (pathname === '/login' || pathname === '/signup') {
//     if (session) {
//       return NextResponse.redirect(new URL('/dashboard', req.url))
//     }
//     return res
//   }

  return res
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/dashbaord/:path*',
    '/articles',
    '/articles/:path*',
    '/articles/write',
    '/login',
    '/signup'
  ]
}
