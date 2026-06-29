import type { SessionCreateInput, SessionUpdateInput } from '@/generated/prisma/models';
import { prisma } from '@/lib/prisma';

export const sessionRepository = {
  create(newSession: SessionCreateInput) {
    return prisma.session.create({
      data: newSession,
    });
  },

  update(sessionId: string, data: SessionUpdateInput) {
    return prisma.session.update({
      where: {
        id: sessionId,
      },
      data,
    });
  },

  findById(sessionId: string) {
    return prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });
  },

  revoke(sessionId: string) {
    return prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },
};
