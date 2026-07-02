import { randomUUID } from 'node:crypto';

import { authConfig } from '../lib/auth.config';
import { sessionRepository } from '../repositories/session.repository';
import type { ServiceCreateSessionResult } from '../types/service-results';
import { tokenService } from './token.service';

export async function createSession(
  userId: string,
  ipAddress?: string,
  userAgent?: string,
): Promise<ServiceCreateSessionResult> {
  const sessionId = randomUUID();

  const payload = {
    userId,
    sessionId,
  };

  const accessToken = await tokenService.generateAccessToken(payload);

  const refreshToken = await tokenService.generateRefreshToken(payload);

  const refreshTokenHash = await tokenService.hashToken(refreshToken);

  await sessionRepository.create({
    id: sessionId,
    user: {
      connect: {
        id: userId,
      },
    },
    refreshTokenHash,
    ipAddress,
    userAgent,
    expiresAt: authConfig.refreshToken.expiresAt(),
  });

  return {
    accessToken,
    refreshToken,
  };
}
