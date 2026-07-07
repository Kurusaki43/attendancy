import type { Prisma } from '@/generated/prisma/client';

export type AuthUser = Prisma.UserGetPayload<{
  include: {
    roles: {
      include: {
        permissions: true;
      };
    };
  };
}>;
