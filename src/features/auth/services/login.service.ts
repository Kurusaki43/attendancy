import { UserStatus } from '@/generated/prisma/client';

import { verifyPassword } from '../lib/password';
import { userRepository } from '../repositories/user.repository';
import type { LoginInput } from '../schemas/login.schema';
import { createSession } from './create-session.service';

export async function login(credentials: LoginInput, ipAddress?: string, userAgent?: string) {
  const { email, password } = credentials;

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.passwordHash) {
    throw new Error('This account uses social login');
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  if (!user.emailVerifiedAt) {
    throw new Error('EMAIL_NOT_VERIFIED');
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new Error('Your account is unavailable');
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
