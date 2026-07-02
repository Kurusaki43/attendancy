import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { AUTH_COOKIES } from '@/features/auth/constants/auth.constant';
import { setAccessTokenCookie, setRefreshTokenCookie } from '@/features/auth/lib/cookies';
import { authenticateWithGoogle } from '@/features/auth/providers/google.service';
import { createSession } from '@/features/auth/services/create-session.service';

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

    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
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
