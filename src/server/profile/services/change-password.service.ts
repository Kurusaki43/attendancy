import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { UnauthorizedError } from '@/lib/errors/unauthorized.error';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/server/auth/lib/password';
import { sessionRepository } from '@/server/auth/repositories/session.repository';
import { userRepository } from '@/server/auth/repositories/user.repository';
import type { ChangePasswordInput } from '@/server/profile/schemas/change-password.schema';
import type { ServiceChangePasswordResult } from '@/server/profile/types';

export async function changePassword(
  userId: string,
  currentSessionId: string,
  input: ChangePasswordInput,
): Promise<ServiceChangePasswordResult> {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new NotFoundError(ERROR_CODES.USER_NOT_FOUND, 'User not found!');
  }

  if (!user.passwordHash) {
    throw new BadRequestError(
      ERROR_CODES.SOCIAL_LOGIN_ONLY,
      'This account uses social login and has no password to change.',
    );
  }

  const isMatch = await verifyPassword(input.currentPassword, user.passwordHash);

  if (!isMatch) {
    throw new UnauthorizedError(
      ERROR_CODES.INVALID_CURRENT_PASSWORD,
      'Current password is incorrect.',
    );
  }

  const newPasswordHash = await hashPassword(input.newPassword);

  await prisma.$transaction([
    userRepository.update({ userId, newData: { passwordHash: newPasswordHash } }),
    sessionRepository.revokeAllExceptSession(userId, currentSessionId),
  ]);

  return {
    success: true,
  };
}
