// proxy.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { AUTH_COOKIES } from '@/features/auth/constants/auth.constant';

const PUBLIC_ROUTES = new Set([
  '/login',
  '/register',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
]);

function isPublicRoute(pathname: string) {
  return [...PUBLIC_ROUTES].some((route) => pathname.startsWith(route));
}

function redirectTo(request: NextRequest, pathname: string) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  const publicRoute = isPublicRoute(pathname);

  // Guest trying to access protected pages
  if (!publicRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url);

    loginUrl.searchParams.set('redirect', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access auth pages
  if (publicRoute && accessToken) {
    return redirectTo(request, '/dashboard');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/verify-email/:path*',
    '/forgot-password',
    '/reset-password/:path*',
  ],
};
