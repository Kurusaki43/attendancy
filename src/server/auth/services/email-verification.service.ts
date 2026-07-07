import type { ServiceEmailVerificationResult } from '@/features/auth/types/service-results';
import { OtpType } from '@/generated/prisma/enums';
import { BadRequestError } from '@/lib/errors/bad-request-error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { prisma } from '@/lib/prisma';

import { verifyOtp } from '../lib/otp';
import { otpRepository } from '../repositories/otp.repository';
import { userRepository } from '../repositories/user.repository';

export async function getPendingVerificationUser(userId: string) {
  return userRepository.findByIdSafeFields(userId);
}

export async function emailVerification(
  code: string,
  userId: string,
): Promise<ServiceEmailVerificationResult> {
  const otp = await otpRepository.findActiveByUserIdAndType({
    type: OtpType.EMAIL_VERIFICATION,
    userId,
  });

  if (!otp) {
    throw new BadRequestError(
      ERROR_CODES.INVALID_RESET_TOKEN,
      'Invalid or expired verification code.',
    );
  }

  const isValid = await verifyOtp(code, otp.codeHash);

  if (!isValid) {
    throw new BadRequestError(
      ERROR_CODES.INVALID_RESET_TOKEN,
      'Invalid or expired verification code.',
    );
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

  return {
    success: true,
  };
}
