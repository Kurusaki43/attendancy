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

vi.mock('../../guards/require-auth', () => ({
  requireAuth: vi.fn(),
}));

vi.mock('../../repositories/user.repository', () => ({
  userRepository: {
    findById: vi.fn(),
  },
}));

const { requireAuth } = await import('../../guards/require-auth');
const { userRepository } = await import('../../repositories/user.repository');
const { getCurrentUser } = await import('../../lib/get-current-user');

function buildUser(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'user-1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    status: 'ACTIVE',
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireAuth).mockResolvedValue({ userId: 'user-1', sessionId: 'session-1' } as never);
});

describe('getCurrentUser', () => {
  it('redirects to invalid-session when the user no longer exists', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    await expect(getCurrentUser()).rejects.toBeInstanceOf(RedirectSignal);
    expect(redirectMock).toHaveBeenCalledWith('/api/auth/invalid-session');
  });

  it('redirects to invalid-session when the user has been suspended', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(
      buildUser({ status: 'SUSPENDED' }) as never,
    );

    await expect(getCurrentUser()).rejects.toBeInstanceOf(RedirectSignal);
    expect(redirectMock).toHaveBeenCalledWith('/api/auth/invalid-session');
  });

  it('redirects to invalid-session when the user has been deactivated', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(
      buildUser({ status: 'INACTIVE' }) as never,
    );

    await expect(getCurrentUser()).rejects.toBeInstanceOf(RedirectSignal);
  });

  it('redirects to invalid-session when the user has not yet accepted their invite', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(
      buildUser({ status: 'INVITED' }) as never,
    );

    await expect(getCurrentUser()).rejects.toBeInstanceOf(RedirectSignal);
  });

  it('returns the user when active', async () => {
    const user = buildUser();
    vi.mocked(userRepository.findById).mockResolvedValue(user as never);

    await expect(getCurrentUser()).resolves.toEqual(user);
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
