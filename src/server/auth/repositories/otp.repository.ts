import type { OtpType } from '@/generated/prisma/enums';
import type { OtpCreateInput } from '@/generated/prisma/models';
import { prisma } from '@/lib/prisma';

type InvalidateActiveOtpsParams = {
  userId: string;
  type: OtpType;
};

type FindActiveOtpParams = {
  userId: string;
  type: OtpType;
};

export const otpRepository = {
  create(newOtp: OtpCreateInput) {
    return prisma.otp.create({
      data: newOtp,
    });
  },

  invalidateActiveOtps({ userId, type }: InvalidateActiveOtpsParams) {
    return prisma.otp.updateMany({
      where: {
        userId,
        type,
        usedAt: null,
        invalidatedAt: null,
      },
      data: {
        invalidatedAt: new Date(),
      },
    });
  },
  findById(id: string) {
    return prisma.otp.findUnique({
      where: {
        id,
      },
    });
  },
  markAsUsed(id: string) {
    return prisma.otp.update({
      where: {
        id,
      },
      data: {
        usedAt: new Date(),
      },
    });
  },
  findActiveByUserIdAndType({ userId, type }: FindActiveOtpParams) {
    return prisma.otp.findFirst({
      where: {
        userId,
        type,
        usedAt: null,
        invalidatedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  },
};
