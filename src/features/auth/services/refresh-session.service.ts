import { authConfig } from '../lib/auth.config';
import { tokenService } from '../lib/token.service';
import { sessionRepository } from '../repositories/session.repository';

export async function refreshSession(refreshToken: string) {
  const { sessionId, userId } = await tokenService.verifyRefreshToken(refreshToken);

  const session = await sessionRepository.findById(sessionId);

  if (!session || session.revokedAt) {
    throw new Error('Invalid session');
  }

  const isValid = await tokenService.compareTokens(refreshToken, session.refreshTokenHash);

  if (!isValid) {
    await sessionRepository.revoke(session.id);

    throw new Error('Invalid refresh token');
  }

  const payload = {
    userId,
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
