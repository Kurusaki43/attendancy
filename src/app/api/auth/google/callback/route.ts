import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { AUTH_COOKIES } from '@/server/auth/constants/auth.constant';
import { setAccessTokenCookie, setRefreshTokenCookie } from '@/server/auth/lib/cookies';
import { getClientIp } from '@/server/auth/lib/get-client-ip';
import { createSession } from '@/server/auth/services/create-session.service';
import { authenticateWithGoogle } from '@/server/auth/services/google-auth.service';

export async function GET(request: Request) {
  const url = new URL(request.url);

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const cookieStore = await cookies();

  const storedState = cookieStore.get(AUTH_COOKIES.GOOGLE_STATE_COOKIE)?.value;

  const codeVerifier = cookieStore.get(AUTH_COOKIES.GOOGLE_CODE_VERIFIER_COOKIE)?.value;

  if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const user = await authenticateWithGoogle(code, codeVerifier);

    const ipAddress = getClientIp(request.headers);
    const userAgent = request.headers.get('user-agent') ?? 'unknown';

    const tokens = await createSession(user.id, ipAddress, userAgent);

    await setAccessTokenCookie(tokens.accessToken);
    await setRefreshTokenCookie(tokens.refreshToken);

    cookieStore.delete(AUTH_COOKIES.GOOGLE_STATE_COOKIE);
    cookieStore.delete(AUTH_COOKIES.GOOGLE_CODE_VERIFIER_COOKIE);

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch {
    cookieStore.delete(AUTH_COOKIES.GOOGLE_STATE_COOKIE);
    cookieStore.delete(AUTH_COOKIES.GOOGLE_CODE_VERIFIER_COOKIE);

    return NextResponse.redirect(new URL('/login?error=google-auth', request.url));
  }
}
