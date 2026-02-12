import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

// Add paths that require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/profile',
  '/orders'
];

// Add paths that are for admins only
const adminRoutes = [
  '/admin'
];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const { pathname } = req.nextUrl;

  // 1. Check if route requires auth
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      const url = new URL('/sign-in', req.url);
      url.searchParams.set('redirect_url', pathname);
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // 2. Check Admin Role
      if (isAdminRoute && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url)); // Or unauthorized page
      }

      // Token is valid, allow
      return NextResponse.next();

    } catch (err) {
      // Invalid token
      const url = new URL('/sign-in', req.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};
