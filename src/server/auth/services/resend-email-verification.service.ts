import { OtpType } from '@/generated/prisma/enums';
import { generateOtp, hashOtp } from '@/server/auth/lib/otp';
import { otpRepository } from '@/server/auth/repositories/otp.repository';
import { userRepository } from '@/server/auth/repositories/user.repository';
import { emailQueueService } from '@/server/mail/services/email-queue.service';

import { authConfig } from '../lib/auth.config';

export async function resendEmailVerification(email: string) {
  const user = await userRepository.findByEmail(email);

  if (!user || user.emailVerifiedAt) {
    return;
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
    expiresAt: authConfig.otp.expiresAt(),
  });

  await emailQueueService.sendVerificationEmail({
    to: user.email,
    firstName: user.firstName,
    code,
  });
}
