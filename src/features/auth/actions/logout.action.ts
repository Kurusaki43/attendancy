'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { logger } from '@/lib/logger';

import { AUTH_COOKIES } from '../constants/auth.constant';
import { clearAuthCookies } from '../lib/cookies';
import { logout } from '../services/logout.service';

export async function logoutAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;
  try {
    await logout(refreshToken);
  } catch (error) {
    logger.error(error, 'Failed to logout user internally');
  }
  await clearAuthCookies();
  redirect('/');
}
