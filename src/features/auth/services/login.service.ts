import { UserStatus } from '@/generated/prisma/client';
import { BadRequestError } from '@/lib/errors/bad-request-error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { ForbiddenError } from '@/lib/errors/forbidden.error';
import { UnauthorizedError } from '@/lib/errors/unauthorized.error';

import { verifyPassword } from '../lib/password';
import { userRepository } from '../repositories/user.repository';
import type { LoginInput } from '../schemas/login.schema';
import type { ServiceLoginResult } from '../types/service-results';
import { createSession } from './create-session.service';

export async function login(
  credentials: LoginInput,
  ipAddress?: string,
  userAgent?: string,
): Promise<ServiceLoginResult> {
  const { email, password } = credentials;

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new UnauthorizedError(ERROR_CODES.INVALID_CREDENTIALS, 'Invalid email or password');
  }

  if (!user.passwordHash) {
    throw new BadRequestError('SOCIAL_LOGIN_ONLY', 'This account uses social login');
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError(ERROR_CODES.INVALID_CREDENTIALS, 'Invalid email or password');
  }

  if (!user.emailVerifiedAt) {
    throw new UnauthorizedError(ERROR_CODES.UNAUTHORIZED, 'Email not verified');
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new ForbiddenError(ERROR_CODES.FORBIDDEN, 'Your account is unavailable');
  }

  const { accessToken, refreshToken } = await createSession(user.id, ipAddress, userAgent);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
    },
  };
}
