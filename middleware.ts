import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/account(.*)',
  '/orders(.*)',
  '/admin(.*)',
  '/video-call(.*)',
]);

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export default clerkMiddleware(async (auth, req) => {
  // Check for custom auth token
  const token = req.cookies.get('auth_token')?.value;
  let isCustomAuthValid = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isCustomAuthValid = true;
    } catch (err) {
      // Invalid token
    }
  }

  // If accessing protected route
  if (isProtectedRoute(req)) {
    // If custom auth is valid, we can skip Clerk protection
    if (isCustomAuthValid) {
      return NextResponse.next();
    }
    // Otherwise, enforce Clerk
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
