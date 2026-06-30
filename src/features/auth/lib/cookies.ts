import { cookies } from 'next/headers';

import { env } from '@/lib/env';

import { AUTH_COOKIES } from '../constants/auth.constant';
import { authConfig } from './auth.config';

function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

export async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(
    AUTH_COOKIES.ACCESS_TOKEN,
    token,
    getCookieOptions(authConfig.accessToken.maxAge),
  );
}

export async function setRefreshTokenCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(
    AUTH_COOKIES.REFRESH_TOKEN,
    token,
    getCookieOptions(authConfig.refreshToken.maxAge),
  );
}

export async function setPendingEmailVerificationCookie(userId: string) {
  const cookieStore = await cookies();

  cookieStore.set(
    AUTH_COOKIES.PENDING_EMAIL_VERIFICATION,
    userId,
    getCookieOptions(authConfig.otp.maxAge),
  );
}

export async function getPendingEmailVerificationCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIES.PENDING_EMAIL_VERIFICATION)?.value;
}

export async function clearPendingEmailVerificationCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIES.PENDING_EMAIL_VERIFICATION);
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIES.ACCESS_TOKEN);
  cookieStore.delete(AUTH_COOKIES.REFRESH_TOKEN);
}
