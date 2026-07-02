import { randomBytes } from 'crypto';

import { emailQueueService } from '@/features/mail/email-queue.service';
import { OtpType } from '@/generated/prisma/enums';
import { env } from '@/lib/env/env';

import { authConfig } from '../lib/auth.config';
import { hashOtp } from '../lib/otp';
import { otpRepository } from '../repositories/otp.repository';
import { userRepository } from '../repositories/user.repository';

export async function forgotPassword(email: string) {
  const user = await userRepository.findByEmail(email);

  if (!user || !user.emailVerifiedAt || !user.passwordHash) {
    return;
  }

  await otpRepository.invalidateActiveOtps({
    userId: user.id,
    type: OtpType.PASSWORD_RESET,
  });

  const token = randomBytes(32).toString('hex');
  const codeHash = await hashOtp(token);

  const otp = await otpRepository.create({
    user: {
      connect: {
        id: user.id,
      },
    },
    type: OtpType.PASSWORD_RESET,
    codeHash,
    expiresAt: authConfig.otp.expiresAt(),
  });

  const url = `${env.APP_URL}/reset-password?id=${otp.id}&token=${token}`;
  await emailQueueService.sendResetPasswordEmail({
    to: user.email,
    firstName: user.firstName,
    resetUrl: url,
  });
}
