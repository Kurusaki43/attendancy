import { prisma } from '@/lib/prisma';

import { verifyOtp } from '../lib/otp';

export async function emailVerification(code: string, userId: string) {
  const otp = await prisma.otp.findFirst({
    where: {
      userId,
      type: 'EMAIL_VERIFICATION',
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
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
