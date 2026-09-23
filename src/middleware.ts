import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionToken = req.cookies.get('fylynx_session')?.value || req.cookies.get('fylynx_session')?.value;

  // Protect /dashboard and /admin routes for unauthenticated users
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    if (!sessionToken) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is logged in and visits landing page '/', '/login' or '/register', redirect automatically to /dashboard
  if (sessionToken && (pathname === '/' || pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
