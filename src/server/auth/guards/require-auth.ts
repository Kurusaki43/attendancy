import { redirect } from 'next/navigation';

import { getAccessTokenCookie } from '../lib/cookies';
import { tokenService } from '../services/token.service';

export async function requireAuth(returnTo: string = '/dashboard') {
  const token = await getAccessTokenCookie();

  if (!token) {
    redirect(`/api/auth/refresh?returnTo=${encodeURIComponent(returnTo)}`);
  }

  const payload = await tokenService.verifyAccessToken(token);

  if (!payload) {
    redirect(`/api/auth/refresh?returnTo=${encodeURIComponent(returnTo)}`);
  }

  return payload;
}
