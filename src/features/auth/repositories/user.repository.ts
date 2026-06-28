import type { UserCreateInput } from '@/generated/prisma/models';
import { prisma } from '@/lib/prisma';

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });
  },
  create(newUser: UserCreateInput) {
    return prisma.user.create({
      data: newUser,
    });
  },
};
