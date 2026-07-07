// src/proxy.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { AUTH_COOKIES } from '@/server/auth/constants/auth.constant';

const GUEST_ONLY_ROUTES = [
  '/login',
  '/register',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
];

function isGuestOnlyRoute(pathname: string) {
  return GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;

  // A user may still be authenticated even if the access token expired.
  const hasSession = Boolean(accessToken || refreshToken);

  const guestOnly = isGuestOnlyRoute(pathname);

  // Guests cannot access protected pages.
  if (!guestOnly && !hasSession) {
    const loginUrl = new URL('/login', request.url);

    loginUrl.searchParams.set('redirect', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Users with a session should not visit auth pages.
  if (guestOnly && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
