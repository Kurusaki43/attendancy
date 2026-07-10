import type * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

class RedirectSignal extends Error {
  constructor(public readonly url: string) {
    super('NEXT_REDIRECT');
  }
}

const redirectMock = vi.fn((url: string) => {
  throw new RedirectSignal(url);
});

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof React>();
  return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock('../../lib/cookies', () => ({
  getAccessTokenCookie: vi.fn(),
}));

vi.mock('../../services/token.service', () => ({
  tokenService: {
    verifyAccessToken: vi.fn(),
  },
}));

vi.mock('../../repositories/session.repository', () => ({
  sessionRepository: {
    findById: vi.fn(),
  },
}));

const { getAccessTokenCookie } = await import('../../lib/cookies');
const { tokenService } = await import('../../services/token.service');
const { sessionRepository } = await import('../../repositories/session.repository');
const { requireAuth } = await import('../../guards/require-auth');

function buildSession(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'session-1',
    revokedAt: null,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('requireAuth', () => {
  it('redirects to refresh when there is no access token cookie', async () => {
    vi.mocked(getAccessTokenCookie).mockResolvedValue(null);

    await expect(requireAuth()).rejects.toBeInstanceOf(RedirectSignal);
    expect(redirectMock).toHaveBeenCalledWith(expect.stringContaining('/api/auth/refresh'));
  });

  it('redirects to refresh when the access token fails verification', async () => {
    vi.mocked(getAccessTokenCookie).mockResolvedValue('bad-token');
    vi.mocked(tokenService.verifyAccessToken).mockResolvedValue(null);

    await expect(requireAuth()).rejects.toBeInstanceOf(RedirectSignal);
    expect(sessionRepository.findById).not.toHaveBeenCalled();
  });

  it('redirects to refresh when the session no longer exists', async () => {
    vi.mocked(getAccessTokenCookie).mockResolvedValue('token');
    vi.mocked(tokenService.verifyAccessToken).mockResolvedValue({
      userId: 'user-1',
      sessionId: 'session-1',
    });
    vi.mocked(sessionRepository.findById).mockResolvedValue(null);

    await expect(requireAuth()).rejects.toBeInstanceOf(RedirectSignal);
  });

  it('redirects to refresh when the session has been revoked', async () => {
    vi.mocked(getAccessTokenCookie).mockResolvedValue('token');
    vi.mocked(tokenService.verifyAccessToken).mockResolvedValue({
      userId: 'user-1',
      sessionId: 'session-1',
    });
    vi.mocked(sessionRepository.findById).mockResolvedValue(
      buildSession({ revokedAt: new Date() }) as never,
    );

    await expect(requireAuth()).rejects.toBeInstanceOf(RedirectSignal);
  });

  it('redirects to refresh when the session has expired', async () => {
    vi.mocked(getAccessTokenCookie).mockResolvedValue('token');
    vi.mocked(tokenService.verifyAccessToken).mockResolvedValue({
      userId: 'user-1',
      sessionId: 'session-1',
    });
    vi.mocked(sessionRepository.findById).mockResolvedValue(
      buildSession({ expiresAt: new Date('2020-01-01T00:00:00.000Z') }) as never,
    );

    await expect(requireAuth()).rejects.toBeInstanceOf(RedirectSignal);
  });

  it('returns the payload when the token is valid and the session is active', async () => {
    vi.mocked(getAccessTokenCookie).mockResolvedValue('token');
    vi.mocked(tokenService.verifyAccessToken).mockResolvedValue({
      userId: 'user-1',
      sessionId: 'session-1',
    });
    vi.mocked(sessionRepository.findById).mockResolvedValue(buildSession() as never);

    await expect(requireAuth()).resolves.toEqual({ userId: 'user-1', sessionId: 'session-1' });
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
