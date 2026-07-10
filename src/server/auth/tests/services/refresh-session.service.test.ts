import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/session.repository', () => ({
  sessionRepository: {
    findById: vi.fn(),
    update: vi.fn(),
    revoke: vi.fn(),
  },
}));

vi.mock('../../repositories/user.repository', () => ({
  userRepository: {
    findById: vi.fn(),
  },
}));

vi.mock('../../services/token.service', () => ({
  tokenService: {
    verifyRefreshToken: vi.fn(),
    compareTokens: vi.fn(),
    generateAccessToken: vi.fn(),
    generateRefreshToken: vi.fn(),
    hashToken: vi.fn(),
  },
}));

vi.mock('../../lib/auth.config', () => ({
  authConfig: {
    refreshToken: {
      expiresAt: vi.fn(),
      graceExpiresAt: vi.fn(),
    },
  },
}));

const { sessionRepository } = await import('../../repositories/session.repository');
const { userRepository } = await import('../../repositories/user.repository');
const { tokenService } = await import('../../services/token.service');
const { authConfig } = await import('../../lib/auth.config');
const { UnauthorizedError } = await import('@/lib/errors/unauthorized.error');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { refreshSession } = await import('../../services/refresh-session.service');

const NOW = new Date('2026-01-01T00:00:00.000Z');
const NEW_EXPIRES_AT = new Date('2026-02-01T00:00:00.000Z');
const GRACE_EXPIRES_AT = new Date('2026-01-01T00:00:30.000Z');

function buildSession(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'session-1',
    userId: 'user-1',
    refreshTokenHash: 'hash-current',
    previousRefreshTokenHash: null,
    previousRefreshTokenExpiresAt: null,
    expiresAt: new Date('2026-06-01T00:00:00.000Z'),
    revokedAt: null,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(NOW);

  vi.mocked(tokenService.verifyRefreshToken).mockResolvedValue({
    userId: 'user-1',
    sessionId: 'session-1',
  });
  vi.mocked(authConfig.refreshToken.expiresAt).mockReturnValue(NEW_EXPIRES_AT);
  vi.mocked(authConfig.refreshToken.graceExpiresAt).mockReturnValue(GRACE_EXPIRES_AT);
  vi.mocked(tokenService.generateAccessToken).mockResolvedValue('new-access-token');
  vi.mocked(tokenService.generateRefreshToken).mockResolvedValue('new-refresh-token');
  vi.mocked(tokenService.hashToken).mockResolvedValue('hash-new');
  vi.mocked(userRepository.findById).mockResolvedValue({ id: 'user-1' } as never);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('refreshSession', () => {
  it('throws UnauthorizedError when the refresh token cannot be verified', async () => {
    vi.mocked(tokenService.verifyRefreshToken).mockResolvedValue(null);

    await expect(refreshSession('bad-token')).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('throws UnauthorizedError when no session is found', async () => {
    vi.mocked(sessionRepository.findById).mockResolvedValue(null);

    await expect(refreshSession('token')).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('throws UnauthorizedError when the session is revoked', async () => {
    vi.mocked(sessionRepository.findById).mockResolvedValue(
      buildSession({ revokedAt: new Date() }) as never,
    );

    await expect(refreshSession('token')).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('revokes and throws when the session has expired', async () => {
    vi.mocked(sessionRepository.findById).mockResolvedValue(
      buildSession({ expiresAt: new Date('2025-01-01T00:00:00.000Z') }) as never,
    );

    await expect(refreshSession('token')).rejects.toBeInstanceOf(UnauthorizedError);
    expect(sessionRepository.revoke).toHaveBeenCalledWith('session-1');
  });

  it('revokes and throws when the token matches neither the current nor previous hash', async () => {
    vi.mocked(sessionRepository.findById).mockResolvedValue(buildSession() as never);
    vi.mocked(tokenService.compareTokens).mockResolvedValue(false);

    await expect(refreshSession('stolen-token')).rejects.toBeInstanceOf(UnauthorizedError);
    expect(sessionRepository.revoke).toHaveBeenCalledWith('session-1');
  });

  it('rotates the token and returns new tokens when it matches the current hash', async () => {
    vi.mocked(sessionRepository.findById).mockResolvedValue(buildSession() as never);
    vi.mocked(tokenService.compareTokens).mockResolvedValue(true);

    const result = await refreshSession('current-token');

    expect(result).toEqual({ accessToken: 'new-access-token', refreshToken: 'new-refresh-token' });
    expect(sessionRepository.revoke).not.toHaveBeenCalled();
    expect(sessionRepository.update).toHaveBeenCalledWith('session-1', {
      refreshTokenHash: 'hash-new',
      previousRefreshTokenHash: 'hash-current',
      previousRefreshTokenExpiresAt: GRACE_EXPIRES_AT,
      expiresAt: NEW_EXPIRES_AT,
    });
  });

  it('accepts the just-rotated-away token within the grace window instead of revoking the session', async () => {
    vi.mocked(sessionRepository.findById).mockResolvedValue(
      buildSession({
        previousRefreshTokenHash: 'hash-previous',
        previousRefreshTokenExpiresAt: new Date('2026-01-01T00:00:20.000Z'),
      }) as never,
    );
    vi.mocked(tokenService.compareTokens).mockImplementation(
      async (_token, hash) => hash === 'hash-previous',
    );

    const result = await refreshSession('racing-token');

    expect(result).toEqual({ accessToken: 'new-access-token', refreshToken: 'new-refresh-token' });
    expect(sessionRepository.revoke).not.toHaveBeenCalled();
  });

  it('revokes and throws when the previous-hash grace window has expired', async () => {
    vi.mocked(sessionRepository.findById).mockResolvedValue(
      buildSession({
        previousRefreshTokenHash: 'hash-previous',
        previousRefreshTokenExpiresAt: new Date('2025-12-31T23:59:00.000Z'),
      }) as never,
    );
    vi.mocked(tokenService.compareTokens).mockImplementation(
      async (_token, hash) => hash === 'hash-previous',
    );

    await expect(refreshSession('stale-token')).rejects.toBeInstanceOf(UnauthorizedError);
    expect(sessionRepository.revoke).toHaveBeenCalledWith('session-1');
  });

  it('revokes and throws NotFoundError when the user no longer exists', async () => {
    vi.mocked(sessionRepository.findById).mockResolvedValue(buildSession() as never);
    vi.mocked(tokenService.compareTokens).mockResolvedValue(true);
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    await expect(refreshSession('current-token')).rejects.toBeInstanceOf(NotFoundError);
    expect(sessionRepository.revoke).toHaveBeenCalledWith('session-1');
  });
});
