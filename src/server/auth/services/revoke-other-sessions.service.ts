import { sessionRepository } from '@/server/auth/repositories/session.repository';

export async function revokeOtherSessions(userId: string, currentSessionId: string) {
  return sessionRepository.revokeAllExceptSession(userId, currentSessionId);
}
