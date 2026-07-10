import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/session.repository', () => ({
  sessionRepository: {
    findById: vi.fn(),
    revoke: vi.fn(),
  },
}));

const { sessionRepository } = await import('../../repositories/session.repository');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { revokeSession } = await import('../../services/revoke-session.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('revokeSession', () => {
  it('throws NotFoundError when the session does not exist', async () => {
    vi.mocked(sessionRepository.findById).mockResolvedValue(null);

    await expect(revokeSession('user-1', 'session-1')).rejects.toBeInstanceOf(NotFoundError);
    expect(sessionRepository.revoke).not.toHaveBeenCalled();
  });

  it('throws NotFoundError when the session belongs to a different user', async () => {
    vi.mocked(sessionRepository.findById).mockResolvedValue({
      id: 'session-1',
      userId: 'someone-else',
    } as never);

    await expect(revokeSession('user-1', 'session-1')).rejects.toBeInstanceOf(NotFoundError);
    expect(sessionRepository.revoke).not.toHaveBeenCalled();
  });

  it('revokes the session when it exists and belongs to the caller', async () => {
    vi.mocked(sessionRepository.findById).mockResolvedValue({
      id: 'session-1',
      userId: 'user-1',
    } as never);

    await revokeSession('user-1', 'session-1');

    expect(sessionRepository.revoke).toHaveBeenCalledWith('session-1');
  });
});
