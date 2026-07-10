import { sessionRepository } from '@/server/auth/repositories/session.repository';
import type { ServiceListSessionsResult } from '@/server/auth/types/service-results';

export async function listSessions(
  userId: string,
  currentSessionId: string,
): Promise<ServiceListSessionsResult> {
  const sessions = await sessionRepository.findManyByUserId(userId);

  const mapped = sessions.map((session) => ({
    id: session.id,
    ipAddress: session.ipAddress,
    userAgent: session.userAgent,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    expiresAt: session.expiresAt,
    isCurrent: session.id === currentSessionId,
  }));

  // Stable sort: current session always leads, everything else keeps its recency order.
  return mapped.sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent));
}
