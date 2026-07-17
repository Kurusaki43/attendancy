import { OtpType } from '@/generated/prisma/enums';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { prisma } from '@/lib/prisma';
import { verifyOtp } from '@/server/auth/lib/otp';
import { hashPassword } from '@/server/auth/lib/password';
import { otpRepository } from '@/server/auth/repositories/otp.repository';
import type { AcceptInviteInput } from '@/server/auth/schemas/accept-invite.schema';
import type { ServiceAcceptInviteResult } from '@/server/auth/types';

export async function acceptInvite(
  payload: AcceptInviteInput,
): Promise<ServiceAcceptInviteResult> {
  const { id, token, password } = payload;

  const otp = await otpRepository.findById(id);

  if (
    !otp ||
    otp.usedAt ||
    otp.type !== OtpType.EMPLOYEE_INVITE ||
    otp.invalidatedAt ||
    otp.expiresAt < new Date()
  ) {
    throw new BadRequestError(
      ERROR_CODES.INVALID_INVITE_TOKEN,
      'Invalid or expired invite link. Please ask an admin to resend your invite.',
    );
  }

  const isMatch = await verifyOtp(token, otp.codeHash);

  if (!isMatch) {
    throw new BadRequestError(
      ERROR_CODES.INVALID_INVITE_TOKEN,
      'Invalid or expired invite link. Please ask an admin to resend your invite.',
    );
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: otp.userId },
      data: {
        passwordHash,
        status: 'ACTIVE',
        emailVerifiedAt: new Date(),
      },
    }),
    otpRepository.markAsUsed(otp.id),
  ]);

  return {
    success: true,
  };
}
