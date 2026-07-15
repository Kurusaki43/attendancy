import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../../auth/repositories/user.repository', () => ({
  userRepository: {
    findById: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../../../auth/repositories/session.repository', () => ({
  sessionRepository: {
    revokeAllExceptSession: vi.fn(),
  },
}));

vi.mock('../../../auth/lib/password', () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}));

const { userRepository } = await import('../../../auth/repositories/user.repository');
const { sessionRepository } = await import('../../../auth/repositories/session.repository');
const { hashPassword, verifyPassword } = await import('../../../auth/lib/password');
const { prisma } = await import('@/lib/prisma');
const { BadRequestError } = await import('@/lib/errors/bad-request.error');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { UnauthorizedError } = await import('@/lib/errors/unauthorized.error');
const { changePassword } = await import('../../services/change-password.service');

const input = { currentPassword: 'old-password', newPassword: 'new-password123' };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('changePassword', () => {
  it('throws NotFoundError when the user does not exist', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    const result = changePassword('user-1', 'session-1', input);

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.USER_NOT_FOUND });
  });

  it('throws BadRequestError when the account has no password (social login only)', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({ passwordHash: null } as never);

    const result = changePassword('user-1', 'session-1', input);

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.SOCIAL_LOGIN_ONLY });
  });

  it('throws UnauthorizedError when the current password does not match', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({ passwordHash: 'hashed' } as never);
    vi.mocked(verifyPassword).mockResolvedValue(false);

    const result = changePassword('user-1', 'session-1', input);

    await expect(result).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.INVALID_CURRENT_PASSWORD });
  });

  it('hashes the new password, revokes other sessions, and returns success', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({ passwordHash: 'hashed' } as never);
    vi.mocked(verifyPassword).mockResolvedValue(true);
    vi.mocked(hashPassword).mockResolvedValue('new-hashed-password');
    vi.mocked(prisma.$transaction).mockResolvedValue([]);

    const result = await changePassword('user-1', 'session-1', input);

    expect(hashPassword).toHaveBeenCalledWith('new-password123');
    expect(userRepository.update).toHaveBeenCalledWith({
      userId: 'user-1',
      newData: { passwordHash: 'new-hashed-password' },
    });
    expect(sessionRepository.revokeAllExceptSession).toHaveBeenCalledWith('user-1', 'session-1');
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });
});
