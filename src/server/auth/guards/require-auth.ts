import { redirect } from 'next/navigation';
import { cache } from 'react';

import { getAccessTokenCookie } from '@/server/auth/lib/cookies';
import { sessionRepository } from '@/server/auth/repositories/session.repository';
import { tokenService } from '@/server/auth/services/token.service';

// Token refresh happens transparently in proxy.ts middleware before this ever runs, so an
// invalid/expired access token here means either a real revocation or a route outside the
// middleware matcher — either way there's nothing left to retry, so this goes straight to
// /login instead of bouncing through a refresh redirect.
export const requireAuth = cache(async () => {
  const token = await getAccessTokenCookie();

  if (!token) {
    redirect('/login');
  }

  const payload = await tokenService.verifyAccessToken(token);

  if (!payload) {
    redirect('/login');
  }

  // The access token's signature/expiry alone doesn't reflect a session revoked in the
  // meantime (e.g. via "log out this session" / "log out other sessions") — it would stay
  // valid until its own short expiry. Check the session itself so revocation is immediate.
  const session = await sessionRepository.findById(payload.sessionId);

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    redirect('/login');
  }

  return payload;
});
