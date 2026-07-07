import { type NextRequest, NextResponse } from 'next/server';

import { AUTH_COOKIES } from '@/server/auth/constants/auth.constant';
import { authConfig } from '@/server/auth/lib/auth.config';
import { getCookieOptions } from '@/server/auth/lib/cookies';
import { refreshSession } from '@/server/auth/services/refresh-session.service';

export async function GET(request: NextRequest) {
  const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;

  const returnTo = request.nextUrl.searchParams.get('returnTo') ?? '/dashboard';

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/api/auth/invalid-session', request.url));
  }

  try {
    const tokens = await refreshSession(refreshToken);

    const response = NextResponse.redirect(new URL(returnTo, request.url));

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
    return NextResponse.redirect(new URL('/api/auth/invalid-session', request.url));
  }
}
