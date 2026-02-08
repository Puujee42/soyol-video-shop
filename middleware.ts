import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED_PATHS = ['/dashboard', '/account'];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (token) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('callbackUrl', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/account',
    '/account/:path*',
  ],
};
