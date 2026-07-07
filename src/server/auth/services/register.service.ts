import { ROLE_NAMES } from '@/features/auth/constants/roles';
import type { RegisterInput } from '@/features/auth/schemas/register.schema';
import type { ServiceRegisterResult } from '@/features/auth/types/service-results';
import { ConflictError } from '@/lib/errors/conflict.error';
import { InternalServerError } from '@/lib/errors/internal-server.error';
import { prisma } from '@/lib/prisma';
import { emailQueueService } from '@/server/mail/services/email-queue.service';

import { authConfig } from '../lib/auth.config';
import { generateOtp, hashOtp } from '../lib/otp';
import { hashPassword } from '../lib/password';
import { otpRepository } from '../repositories/otp.repository';
import { userRepository } from '../repositories/user.repository';

export async function register(body: RegisterInput): Promise<ServiceRegisterResult> {
  // 1- verify if user exists before
  const existingUser = await userRepository.findByEmail(body.email);
  if (existingUser) {
    throw new ConflictError('EMAIL_ALREADY_EXISTS', 'Email already exists');
  }

  // 2- create a password hash
  const passwordHash = await hashPassword(body.password);

  // 3- Get the EMPLOYEE role (default role for new users)
  const employeeRole = await prisma.role.findUnique({
    where: { name: ROLE_NAMES.EMPLOYEE },
  });

  if (!employeeRole) {
    throw new InternalServerError(
      'ROLE_NOT_FOUND',
      'EMPLOYEE role not found. Please run database seeds.',
    );
  }

  // 4- create user with EMPLOYEE role
  const user = await userRepository.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    passwordHash,
    provider: 'LOCAL',
    roles: {
      connect: {
        id: employeeRole.id,
      },
    },
  });

  // 5- generate code otp
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
    expiresAt: authConfig.otp.expiresAt(),
  });

  // 6- Enque email
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
