import type { OtpCreateInput } from '@/generated/prisma/models';
import { prisma } from '@/lib/prisma';

export const otpRepository = {
  create(newOtp: OtpCreateInput) {
    return prisma.otp.create({
      data: newOtp,
    });
  },
};
