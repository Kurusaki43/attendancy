import { generateCodeVerifier, generateState } from 'arctic';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { AUTH_COOKIES } from '@/server/auth/constants/auth.constant';
import { google } from '@/server/auth/lib/google';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const locale = requestUrl.searchParams.get('locale');
  const timezone = requestUrl.searchParams.get('timezone');

  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const authUrl = google.createAuthorizationURL(state, codeVerifier, [
    'openid',
    'profile',
    'email',
  ]);

  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 10,
  };

  cookieStore.set(AUTH_COOKIES.GOOGLE_STATE_COOKIE, state, cookieOptions);
  cookieStore.set(AUTH_COOKIES.GOOGLE_CODE_VERIFIER_COOKIE, codeVerifier, cookieOptions);

  if (locale) {
    cookieStore.set(AUTH_COOKIES.GOOGLE_LOCALE_COOKIE, locale, cookieOptions);
  }

  if (timezone) {
    cookieStore.set(AUTH_COOKIES.GOOGLE_TIMEZONE_COOKIE, timezone, cookieOptions);
  }

  return NextResponse.redirect(authUrl);
}
