import { tokenService } from '../lib/token.service';
import { sessionRepository } from '../repositories/session.repository';

export async function logout(refreshToken?: string) {
  if (!refreshToken) {
    return;
  }

  const payload = await tokenService.verifyRefreshToken(refreshToken);

  if (!payload) {
    return;
  }

  const session = await sessionRepository.findById(payload.sessionId);

  if (!session || session.revokedAt) {
    return;
  }

  const matches = await tokenService.compareTokens(refreshToken, session.refreshTokenHash);

  if (!matches) {
    return;
  }

  await sessionRepository.revoke(session.id);
}
