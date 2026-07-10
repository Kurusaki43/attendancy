import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/session.repository', () => ({
  sessionRepository: {
    findManyByUserId: vi.fn(),
  },
}));

const { sessionRepository } = await import('../../repositories/session.repository');
const { listSessions } = await import('../../services/list-sessions.service');

function buildSession(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'session-1',
    userId: 'user-1',
    ipAddress: '127.0.0.1',
    userAgent: 'test-agent',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    expiresAt: new Date('2026-02-01T00:00:00.000Z'),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('listSessions', () => {
  it('returns an empty list when the user has no active sessions', async () => {
    vi.mocked(sessionRepository.findManyByUserId).mockResolvedValue([]);

    const result = await listSessions('user-1', 'session-1');

    expect(result).toEqual([]);
  });

  it('marks the session matching currentSessionId as current', async () => {
    vi.mocked(sessionRepository.findManyByUserId).mockResolvedValue([
      buildSession({ id: 'session-1' }),
      buildSession({ id: 'session-2' }),
    ] as never);

    const result = await listSessions('user-1', 'session-2');

    expect(result).toEqual([
      expect.objectContaining({ id: 'session-2', isCurrent: true }),
      expect.objectContaining({ id: 'session-1', isCurrent: false }),
    ]);
  });

  it('always sorts the current session first, regardless of repository order', async () => {
    vi.mocked(sessionRepository.findManyByUserId).mockResolvedValue([
      buildSession({ id: 'session-1' }),
      buildSession({ id: 'session-2' }),
      buildSession({ id: 'session-3' }),
    ] as never);

    const result = await listSessions('user-1', 'session-3');

    expect(result.map((session) => session.id)).toEqual(['session-3', 'session-1', 'session-2']);
  });

  it('keeps the raw ipAddress/userAgent for the caller to format', async () => {
    vi.mocked(sessionRepository.findManyByUserId).mockResolvedValue([
      buildSession({ ipAddress: '10.0.0.1', userAgent: 'Mozilla/5.0' }),
    ] as never);

    const result = await listSessions('user-1', 'session-1');

    expect(result[0]).toMatchObject({ ipAddress: '10.0.0.1', userAgent: 'Mozilla/5.0' });
  });

  it('passes through expiresAt for the caller to display', async () => {
    const expiresAt = new Date('2026-03-01T00:00:00.000Z');
    vi.mocked(sessionRepository.findManyByUserId).mockResolvedValue([
      buildSession({ expiresAt }),
    ] as never);

    const result = await listSessions('user-1', 'session-1');

    expect(result[0]).toMatchObject({ expiresAt });
  });
});
