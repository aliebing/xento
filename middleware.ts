import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_USER = process.env.ADMIN_USER ?? 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS ?? 'admin';

function expectedAuth() {
  const credentials = `${ADMIN_USER}:${ADMIN_PASS}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
}

export function middleware(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (authorization === expectedAuth()) return NextResponse.next();

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Xento Admin"' },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
