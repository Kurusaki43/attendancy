import { addMinutes } from 'date-fns';

import { emailQueueService } from '@/features/mail/services/email-queue.service';
import { OtpType } from '@/generated/prisma/enums';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';

import { generateOtp, hashOtp } from '../lib/otp';
import { otpRepository } from '../repositories/otp.repository';
import { userRepository } from '../repositories/user.repository';

export async function resendEmailVerification(email: string) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new NotFoundError(ERROR_CODES.USER_NOT_FOUND, 'User not found');
  }

  if (user.emailVerifiedAt) {
    throw new NotFoundError(ERROR_CODES.EMAIL_ALREADY_VERIFIED, 'Email already verified');
  }

  await otpRepository.invalidateActiveOtps({
    userId: user.id,
    type: OtpType.EMAIL_VERIFICATION,
  });

  const code = generateOtp();
  const codeHash = await hashOtp(code);

  await otpRepository.create({
    user: {
      connect: {
        id: user.id,
      },
    },
    type: OtpType.EMAIL_VERIFICATION,
    codeHash,
    expiresAt: addMinutes(new Date(), 15),
  });

  await emailQueueService.sendVerificationEmail({
    to: user.email,
    firstName: user.firstName,
    code,
  });

  return {
    message: 'Verification email sent successfully',
  };
}
