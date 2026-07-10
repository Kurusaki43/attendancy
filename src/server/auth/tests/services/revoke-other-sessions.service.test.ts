import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/session.repository', () => ({
  sessionRepository: {
    revokeAllExceptSession: vi.fn(),
  },
}));

const { sessionRepository } = await import('../../repositories/session.repository');
const { revokeOtherSessions } = await import('../../services/revoke-other-sessions.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('revokeOtherSessions', () => {
  it('revokes every session for the user except the current one', async () => {
    vi.mocked(sessionRepository.revokeAllExceptSession).mockResolvedValue({ count: 2 } as never);

    await revokeOtherSessions('user-1', 'session-1');

    expect(sessionRepository.revokeAllExceptSession).toHaveBeenCalledWith('user-1', 'session-1');
  });
});
