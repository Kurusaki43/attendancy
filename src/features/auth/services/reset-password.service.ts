import { OtpType } from '@/generated/prisma/enums';
import { prisma } from '@/lib/prisma';

import { verifyOtp } from '../lib/otp';
import { hashPassword } from '../lib/password';
import { otpRepository } from '../repositories/otp.repository';
import { sessionRepository } from '../repositories/session.repository';
import { userRepository } from '../repositories/user.repository';
import type { ResetPasswordType } from '../schemas/reset-password.schema';

export async function resetPassword(payload: ResetPasswordType) {
  const { id, token, newPassword } = payload;

  const otp = await otpRepository.findById(id);

  if (
    !otp ||
    otp.usedAt ||
    otp.type !== OtpType.PASSWORD_RESET ||
    otp.invalidatedAt ||
    otp.expiresAt < new Date()
  ) {
    throw new Error('Invalid or expired reset link');
  }

  const isMatch = await verifyOtp(token, otp.codeHash);

  if (!isMatch) {
    throw new Error('Invalid or expired reset link');
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
}
