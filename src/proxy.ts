// src/proxy.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { checkRateLimit } from '@/infrastructure/rate-limit/rate-limiter';
import { AUTH_COOKIES } from '@/server/auth/constants/auth.constant';
import { RATE_LIMITS } from '@/server/auth/constants/rate-limit.constant';
import { authConfig } from '@/server/auth/lib/auth.config';
import { getCookieOptions } from '@/server/auth/lib/cookies';
import { getClientIp } from '@/server/auth/lib/get-client-ip';
import { refreshSession } from '@/server/auth/services/refresh-session.service';
import { tokenService } from '@/server/auth/services/token.service';

// Next's proxy.ts (the renamed middleware convention) always runs on the Node.js runtime, so
// refreshSession's Prisma + @node-rs/argon2 calls (neither Edge-compatible) work here with no
// extra config — unlike middleware.ts in older Next versions, this needs no `runtime` export.

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

function redirectToLogin(request: NextRequest, redirectTarget: string) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', redirectTarget);

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(AUTH_COOKIES.ACCESS_TOKEN);
  response.cookies.delete(AUTH_COOKIES.REFRESH_TOKEN);

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const guestOnly = isGuestOnlyRoute(pathname);

  const accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;

  // Access token still valid (signature + expiry) — no refresh needed. This is a lightweight
  // check only; the DB-backed revocation check still happens in requireAuth() for every
  // protected render, same as before.
  if (accessToken && (await tokenService.verifyAccessToken(accessToken))) {
    return guestOnly
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.next();
  }

  if (refreshToken) {
    const ipAddress = getClientIp(request.headers);

    // A shared 'unknown' bucket would let one client with an undetermined IP exhaust the limit
    // for every other client stuck with the same fallback, so skip enforcement in that case.
    if (ipAddress !== 'unknown') {
      const rateLimit = await checkRateLimit({
        key: `refresh:ip:${ipAddress}`,
        ...RATE_LIMITS.REFRESH_IP,
      });

      if (!rateLimit.allowed) {
        return NextResponse.json(
          { message: 'Too many requests. Please try again later.' },
          { status: 429 },
        );
      }
    }

    try {
      const tokens = await refreshSession(refreshToken);

      // Mutate the incoming request's cookies too, not just the outgoing response — this is
      // what makes the fresh access token visible to this same request's Server Components,
      // instead of only taking effect on the browser's next navigation.
      request.cookies.set(AUTH_COOKIES.ACCESS_TOKEN, tokens.accessToken);
      request.cookies.set(AUTH_COOKIES.REFRESH_TOKEN, tokens.refreshToken);

      const response = guestOnly
        ? NextResponse.redirect(new URL('/dashboard', request.url))
        : NextResponse.next({ request });

      response.cookies.set(
        AUTH_COOKIES.ACCESS_TOKEN,
        tokens.accessToken,
        getCookieOptions(authConfig.accessToken.maxAge),
      );
      response.cookies.set(
        AUTH_COOKIES.REFRESH_TOKEN,
        tokens.refreshToken,
        getCookieOptions(authConfig.refreshToken.maxAge),
      );

      return response;
    } catch {
      // Refresh token invalid/revoked/expired — fall through to unauthenticated handling.
    }
  }

  if (guestOnly) {
    return NextResponse.next();
  }

  return redirectToLogin(request, pathname + search);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/attendance-qr',
    '/attendance-scan',

    '/login',
    '/register',

    '/verify-email/:path*',
    '/forgot-password',
    '/reset-password/:path*',
  ],
};
