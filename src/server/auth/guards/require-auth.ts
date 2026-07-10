import { redirect } from 'next/navigation';
import { cache } from 'react';

import { getAccessTokenCookie } from '@/server/auth/lib/cookies';
import { sessionRepository } from '@/server/auth/repositories/session.repository';
import { tokenService } from '@/server/auth/services/token.service';

export const requireAuth = cache(async (returnTo: string = '/dashboard') => {
  const token = await getAccessTokenCookie();

  if (!token) {
    redirect(`/api/auth/refresh?returnTo=${encodeURIComponent(returnTo)}`);
  }

  const payload = await tokenService.verifyAccessToken(token);

  if (!payload) {
    redirect(`/api/auth/refresh?returnTo=${encodeURIComponent(returnTo)}`);
  }

  // The access token's signature/expiry alone doesn't reflect a session revoked in the
  // meantime (e.g. via "log out this session" / "log out other sessions") — it would stay
  // valid until its own short expiry. Check the session itself so revocation is immediate.
  const session = await sessionRepository.findById(payload.sessionId);

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    redirect(`/api/auth/refresh?returnTo=${encodeURIComponent(returnTo)}`);
  }

  return payload;
});
