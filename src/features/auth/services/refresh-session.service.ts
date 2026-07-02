import { authConfig } from '../lib/auth.config';
import { tokenService } from '../lib/token.service';
import { sessionRepository } from '../repositories/session.repository';
import { userRepository } from '../repositories/user.repository';

export async function refreshSession(refreshToken: string) {
  const refreshPayload = await tokenService.verifyRefreshToken(refreshToken);

  if (!refreshPayload) {
    throw new Error('Invalid refresh token');
  }

  const session = await sessionRepository.findById(refreshPayload.sessionId);

  if (!session || session.revokedAt) {
    throw new Error('Invalid session');
  }

  if (session.expiresAt < new Date()) {
    await sessionRepository.revoke(session.id);

    throw new Error('Session expired');
  }

  const isValid = await tokenService.compareTokens(refreshToken, session.refreshTokenHash);

  if (!isValid) {
    await sessionRepository.revoke(session.id);

    throw new Error('Invalid refresh token');
  }

  const user = await userRepository.findById(refreshPayload.userId);

  if (!user) {
    await sessionRepository.revoke(session.id);

    throw new Error('User not found');
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
