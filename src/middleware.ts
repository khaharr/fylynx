import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['fr', 'en', 'ar', 'de', 'es', 'zh'];
const DEFAULT_LOCALE = 'fr';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Ignore internal Next.js routes (_next, _document, etc.), static files, API, sitemap & robots
  if (
    pathname.startsWith('/_') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  const isLocalePrefixed = SUPPORTED_LOCALES.includes(maybeLocale);

  // 1. If URL is NOT locale-prefixed (e.g. /blog, /dashboard, /login, or /)
  if (!isLocalePrefixed) {
    const savedCookie = req.cookies.get('fylynx_lang')?.value;
    const locale = (savedCookie && SUPPORTED_LOCALES.includes(savedCookie)) ? savedCookie : DEFAULT_LOCALE;
    const targetPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
    const redirectUrl = new URL(`${targetPath}${search}`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. If URL IS locale-prefixed (e.g. /fr, /en/blog, /ar/dashboard)
  const locale = maybeLocale;
  const rawRest = segments.slice(2).join('/');
  const restPath = rawRest ? `/${rawRest}` : '/';
  const sessionToken = req.cookies.get('fylynx_session')?.value;

  // Protected routes check (/dashboard, /admin)
  if (restPath.startsWith('/dashboard') || restPath.startsWith('/admin')) {
    if (!sessionToken) {
      const loginUrl = new URL(`/${locale}/login`, req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Auto-redirect logged-in users visiting landing, login or register
  if (sessionToken && (restPath === '/' || restPath === '/login' || restPath === '/register')) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
  }

  // Rewrite internally to the target underlying route (e.g. / or /blog or /login) with ?lang=${locale}
  const rewriteUrl = new URL(`${restPath}${search}`, req.url);
  rewriteUrl.searchParams.set('lang', locale);

  const response = NextResponse.rewrite(rewriteUrl);
  response.cookies.set('fylynx_lang', locale, { path: '/', maxAge: 31536000 });
  response.headers.set('x-fylynx-locale', locale);

  return response;
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
