import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/user.repository', () => ({
  userRepository: {
    findByEmail: vi.fn(),
  },
}));

vi.mock('../../lib/password', () => ({
  verifyPassword: vi.fn(),
}));

vi.mock('../../services/create-session.service', () => ({
  createSession: vi.fn(),
}));

const { userRepository } = await import('../../repositories/user.repository');
const { verifyPassword } = await import('../../lib/password');
const { createSession } = await import('../../services/create-session.service');
const { BadRequestError } = await import('@/lib/errors/bad-request.error');
const { ForbiddenError } = await import('@/lib/errors/forbidden.error');
const { UnauthorizedError } = await import('@/lib/errors/unauthorized.error');
const { login } = await import('../../services/login.service');

function buildUser(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'user-1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    avatar: null,
    passwordHash: 'hashed-password',
    emailVerifiedAt: new Date(),
    status: 'ACTIVE',
    ...overrides,
  };
}

const credentials = { email: 'ada@example.com', password: 'password123' };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('login', () => {
  it('throws UnauthorizedError when no user exists for the email', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    const result = login(credentials);

    await expect(result).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.INVALID_CREDENTIALS });
  });

  it('throws BadRequestError when the account has no password (social login only)', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(
      buildUser({ passwordHash: null }) as never,
    );

    const result = login(credentials);

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.SOCIAL_LOGIN_ONLY });
  });

  it('throws UnauthorizedError when the password does not match', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(buildUser() as never);
    vi.mocked(verifyPassword).mockResolvedValue(false);

    const result = login(credentials);

    await expect(result).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.INVALID_CREDENTIALS });
  });

  it('throws UnauthorizedError when the email is not verified', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(
      buildUser({ emailVerifiedAt: null }) as never,
    );
    vi.mocked(verifyPassword).mockResolvedValue(true);

    const result = login(credentials);

    await expect(result).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMAIL_NOT_VERIFIED });
  });

  it('throws ForbiddenError when the account is not active', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(
      buildUser({ status: 'SUSPENDED' }) as never,
    );
    vi.mocked(verifyPassword).mockResolvedValue(true);

    const result = login(credentials);

    await expect(result).rejects.toBeInstanceOf(ForbiddenError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.FORBIDDEN });
  });

  it('creates a session and returns tokens with a trimmed user payload on success', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(buildUser() as never);
    vi.mocked(verifyPassword).mockResolvedValue(true);
    vi.mocked(createSession).mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    const result = await login(credentials, '127.0.0.1', 'test-agent');

    expect(createSession).toHaveBeenCalledWith('user-1', '127.0.0.1', 'test-agent');
    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: {
        id: 'user-1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        avatar: null,
      },
    });
  });
});
