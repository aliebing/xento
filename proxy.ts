import { NextResponse, type NextRequest } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedInit } from '@/lib/auth';
import { hasLocale, negotiateLocale, switchLocalePath } from '@/lib/i18n/config';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin: Basic Auth wie bisher, keine Sprachweiche.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const authorization = request.headers.get('authorization');
    if (isAuthorizedAdminRequest(authorization)) return NextResponse.next();

    return new NextResponse('Authentication required', unauthorizedInit());
  }

  if (hasLocale(pathname.split('/')[1])) return NextResponse.next();

  const locale = negotiateLocale(request.headers.get('accept-language'));
  const url = request.nextUrl.clone();
  url.pathname = switchLocalePath(pathname, locale);

  const response = NextResponse.redirect(url);
  response.headers.set('Vary', 'Accept-Language');
  return response;
}

export const config = {
  // Alles außer API-Routen, Next-Interna und Dateien mit Endung (Bilder, Favicon, …).
  matcher: ['/((?!api/|_next/|.*\\..*).*)'],
};
