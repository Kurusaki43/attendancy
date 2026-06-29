import { JWTExpired, JWTInvalid } from 'jose/errors';

import { logger } from '@/lib/logger';

import { tokenService } from '../lib/token.service';
import { sessionRepository } from '../repositories/session.repository';

export async function logout(refreshToken: string) {
  try {
    const { sessionId } = await tokenService.verifyRefreshToken(refreshToken);

    const session = await sessionRepository.findById(sessionId);

    if (!session || session.revokedAt) {
      return;
    }

    const matches = await tokenService.compareTokens(refreshToken, session.refreshTokenHash);

    if (!matches) {
      logger.warn({ sessionId }, 'Refresh token hash mismatch during logout');
      return;
    }

    await sessionRepository.revoke(sessionId);
  } catch (error) {
    if (error instanceof JWTExpired || error instanceof JWTInvalid) {
      logger.debug({ error }, 'Ignoring invalid refresh token during logout');
      return;
    }

    logger.error({ error }, 'Failed to logout user');
    throw error;
  }
}
