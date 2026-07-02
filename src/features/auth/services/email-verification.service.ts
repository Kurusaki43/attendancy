import { OtpType } from '@/generated/prisma/enums';
import { prisma } from '@/lib/prisma';

import { verifyOtp } from '../lib/otp';
import { otpRepository } from '../repositories/otp.repository';

export async function emailVerification(code: string, userId: string) {
  const otp = await otpRepository.findActiveByUserIdAndType({
    type: OtpType.EMAIL_VERIFICATION,
    userId,
  });

  if (!otp) {
    throw new Error('Invalid or expired verification code.');
  }

  const isValid = await verifyOtp(code, otp.codeHash);

  if (!isValid) {
    throw new Error('Invalid or expired verification code.');
  }

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: otp.userId,
      },
      data: {
        emailVerifiedAt: new Date(),
        status: 'ACTIVE',
      },
    }),

    prisma.otp.update({
      where: {
        id: otp.id,
      },
      data: {
        usedAt: new Date(),
      },
    }),
  ]);
}
