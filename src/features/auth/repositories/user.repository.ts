import type { UserCreateInput, UserUpdateInput } from '@/generated/prisma/models';
import { prisma } from '@/lib/prisma';

const userInclude = {
  roles: {
    include: {
      permissions: true,
    },
  },
} as const;

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: userInclude,
    });
  },

  findByIdSafeFields(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: userInclude,
    });
  },
  create(newUser: UserCreateInput) {
    return prisma.user.create({
      data: newUser,
      include: userInclude,
    });
  },
  update({ userId, newData }: { userId: string; newData: UserUpdateInput }) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: newData,
      include: userInclude,
    });
  },
};
