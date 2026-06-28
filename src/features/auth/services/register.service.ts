import { addMinutes } from 'date-fns';

import { emailQueueService } from '@/features/mail/email-queue.service';

import { generateOtp, hashOtp } from '../lib/otp';
import { hashPassword } from '../lib/password';
import { otpRepository } from '../repositories/otp.repository';
import { userRepository } from '../repositories/user.repository';
import type { RegisterInput } from '../schemas/register.schema';

export async function register(body: RegisterInput) {
  // 1- verify if user exists before
  const existingUser = await userRepository.findByEmail(body.email);
  if (existingUser) {
    throw new Error('User Already exists');
  }

  // 2- create a password hash
  const passwordHash = await hashPassword(body.password);

  // 3- create user
  const user = await userRepository.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    passwordHash,
    provider: 'LOCAL',
  });

  // 4- generate code otp
  const code = generateOtp();
  const hashedCode = await hashOtp(code);

  await otpRepository.create({
    user: {
      connect: {
        id: user.id,
      },
    },
    type: 'EMAIL_VERIFICATION',
    codeHash: hashedCode,
    expiresAt: addMinutes(new Date(), 15),
  });

  // 5- Enque email
  await emailQueueService.sendVerificationEmail({
    to: user.email,
    firstName: user.firstName,
    code,
  });

  return {
    id: user.id,
    email: user.email,
    requiresEmailVerification: true,
  };
}
