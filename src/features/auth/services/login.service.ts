import { randomUUID } from 'node:crypto';

import { UserStatus } from '@/generated/prisma/client';

import { authConfig } from '../lib/auth.config';
import { verifyPassword } from '../lib/password';
import { tokenService } from '../lib/token.service';
import { sessionRepository } from '../repositories/session.repository';
import { userRepository } from '../repositories/user.repository';
import type { LoginInput } from '../schemas/login.schema';

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
    throw new Error('Please verify your email first');
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new Error('Your account is unavailable');
  }

  const sessionId = randomUUID();

  const payload = {
    userId: user.id,
    sessionId,
  };

  const accessToken = await tokenService.generateAccessToken(payload);

  const refreshToken = await tokenService.generateRefreshToken(payload);

  const refreshTokenHash = await tokenService.hashToken(refreshToken);

  await sessionRepository.create({
    id: sessionId,
    user: {
      connect: {
        id: user.id,
      },
    },
    refreshTokenHash,
    ipAddress,
    userAgent,
    expiresAt: authConfig.refreshToken.expiresAt(),
  });

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
