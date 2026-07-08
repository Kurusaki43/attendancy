import { randomBytes } from 'crypto';

import { OtpType } from '@/generated/prisma/enums';
import { env } from '@/lib/env/env';
import { authConfig } from '@/server/auth/lib/auth.config';
import { hashOtp } from '@/server/auth/lib/otp';
import { otpRepository } from '@/server/auth/repositories/otp.repository';
import { userRepository } from '@/server/auth/repositories/user.repository';
import { emailQueueService } from '@/server/mail/services/email-queue.service';

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
