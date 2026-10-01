import { NextResponse, type NextRequest } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedInit } from '@/lib/auth';

export function proxy(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (isAuthorizedAdminRequest(authorization)) return NextResponse.next();

  return new NextResponse('Authentication required', unauthorizedInit());
}

export const config = {
  matcher: ['/admin/:path*'],
};
