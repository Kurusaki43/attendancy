import { OtpType } from '@/generated/prisma/enums';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { prisma } from '@/lib/prisma';
import { verifyOtp } from '@/server/auth/lib/otp';
import { hashPassword } from '@/server/auth/lib/password';
import { otpRepository } from '@/server/auth/repositories/otp.repository';
import { sessionRepository } from '@/server/auth/repositories/session.repository';
import { userRepository } from '@/server/auth/repositories/user.repository';
import type { ResetPasswordInput } from '@/server/auth/schemas/reset-password.schema';
import type { ServiceResetPasswordResult } from '@/server/auth/types';

export async function resetPassword(
  payload: ResetPasswordInput,
): Promise<ServiceResetPasswordResult> {
  const { id, token, newPassword } = payload;

  const otp = await otpRepository.findById(id);

  if (
    !otp ||
    otp.usedAt ||
    otp.type !== OtpType.PASSWORD_RESET ||
    otp.invalidatedAt ||
    otp.expiresAt < new Date()
  ) {
    throw new BadRequestError(
      ERROR_CODES.INVALID_RESET_TOKEN,
      'Invalid or expired reset link. Please request a new password reset email.',
    );
  }

  const isMatch = await verifyOtp(token, otp.codeHash);

  if (!isMatch) {
    throw new BadRequestError(
      ERROR_CODES.INVALID_RESET_TOKEN,
      'Invalid or expired reset link. Please request a new password reset email.',
    );
  }

  const newPasswordHashed = await hashPassword(newPassword);

  await prisma.$transaction([
    userRepository.update({
      userId: otp.userId,
      newData: {
        passwordHash: newPasswordHashed,
      },
    }),
    sessionRepository.revokeAllUserSessions(otp.userId),
    otpRepository.markAsUsed(otp.id),
  ]);

  return {
    success: true,
  };
}
