import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { sessionRepository } from '@/server/auth/repositories/session.repository';

export async function revokeSession(userId: string, sessionId: string): Promise<void> {
  const session = await sessionRepository.findById(sessionId);

  // Same error whether the session doesn't exist or just isn't owned by this user, so we
  // don't leak whether another user's session id exists.
  if (!session || session.userId !== userId) {
    throw new NotFoundError(ERROR_CODES.SESSION_NOT_FOUND, 'Session not found.');
  }

  await sessionRepository.revoke(sessionId);
}
