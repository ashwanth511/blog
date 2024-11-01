import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  // Protected routes
  const protectedRoutes = ['/dashboard', '/articles/write']
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/dashboard/:path*',
    '/articles',
    '/articles/:path*',
    '/articles/write',
    '/login',
    '/signup'
  ]
}
