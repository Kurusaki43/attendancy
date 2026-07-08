import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { UnauthorizedError } from '@/lib/errors/unauthorized.error';
import { authConfig } from '@/server/auth/lib/auth.config';
import { sessionRepository } from '@/server/auth/repositories/session.repository';
import { userRepository } from '@/server/auth/repositories/user.repository';
import type { ServiceRefreshSessionResult } from '@/server/auth/types/service-results';

import { tokenService } from './token.service';

export async function refreshSession(refreshToken: string): Promise<ServiceRefreshSessionResult> {
  const refreshPayload = await tokenService.verifyRefreshToken(refreshToken);

  if (!refreshPayload) {
    throw new UnauthorizedError(ERROR_CODES.UNAUTHORIZED, 'Invalid refresh token');
  }

  const session = await sessionRepository.findById(refreshPayload.sessionId);

  if (!session || session.revokedAt) {
    throw new UnauthorizedError(ERROR_CODES.UNAUTHORIZED, 'Invalid session');
  }

  if (session.expiresAt < new Date()) {
    await sessionRepository.revoke(session.id);

    throw new UnauthorizedError(ERROR_CODES.UNAUTHORIZED, 'Session expired');
  }

  const isValid = await tokenService.compareTokens(refreshToken, session.refreshTokenHash);

  if (!isValid) {
    await sessionRepository.revoke(session.id);

    throw new UnauthorizedError(ERROR_CODES.UNAUTHORIZED, 'Invalid refresh token');
  }

  const user = await userRepository.findById(refreshPayload.userId);

  if (!user) {
    await sessionRepository.revoke(session.id);

    throw new NotFoundError(ERROR_CODES.USER_NOT_FOUND, 'User not found');
  }

  const payload = {
    userId: refreshPayload.userId,
    sessionId: session.id,
  };

  const accessToken = await tokenService.generateAccessToken(payload);

  const newRefreshToken = await tokenService.generateRefreshToken(payload);

  const refreshTokenHash = await tokenService.hashToken(newRefreshToken);

  await sessionRepository.update(session.id, {
    refreshTokenHash,
    expiresAt: authConfig.refreshToken.expiresAt(),
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}
