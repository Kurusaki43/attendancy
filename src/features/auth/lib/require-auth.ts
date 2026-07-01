import { redirect } from 'next/navigation';

import { getAccessTokenCookie } from './cookies';
import { tokenService } from './token.service';

export async function requireAuth() {
  const token = await getAccessTokenCookie();

  if (!token) {
    redirect('/login');
  }

  const payload = await tokenService.verifyAccessToken(token);

  if (!payload) {
    redirect('/login');
  }

  return payload;
}
