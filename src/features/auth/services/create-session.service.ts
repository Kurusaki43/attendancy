import { randomUUID } from 'node:crypto';

import type { User } from '@/generated/prisma/client';

import { authConfig } from '../lib/auth.config';
import { tokenService } from '../lib/token.service';
import { sessionRepository } from '../repositories/session.repository';

export async function createSession(user: User, ipAddress?: string, userAgent?: string) {
  const sessionId = randomUUID();

  const payload = {
    userId: user.id,
    sessionId,
  };

  const accessToken = await tokenService.generateAccessToken(payload);

  const refreshToken = await tokenService.generateRefreshToken(payload);

  const refreshTokenHash = await tokenService.hashToken(refreshToken);

  await sessionRepository.create({
    id: sessionId,
    user: {
      connect: {
        id: user.id,
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
