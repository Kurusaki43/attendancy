import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/session.repository', () => ({
  sessionRepository: {
    create: vi.fn(),
  },
}));

vi.mock('../../services/token.service', () => ({
  tokenService: {
    generateAccessToken: vi.fn(),
    generateRefreshToken: vi.fn(),
    hashToken: vi.fn(),
  },
}));

const { sessionRepository } = await import('../../repositories/session.repository');
const { tokenService } = await import('../../services/token.service');
const { createSession } = await import('../../services/create-session.service');

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(tokenService.generateAccessToken).mockResolvedValue('access-token');
  vi.mocked(tokenService.generateRefreshToken).mockResolvedValue('refresh-token');
  vi.mocked(tokenService.hashToken).mockResolvedValue('hashed-refresh-token');
  vi.mocked(sessionRepository.create).mockResolvedValue({} as never);
});

describe('createSession', () => {
  it('returns the generated access and refresh tokens', async () => {
    const result = await createSession('user-1');

    expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
  });

  it('persists a session with the hashed refresh token and connects it to the user', async () => {
    await createSession('user-1', '127.0.0.1', 'test-agent');

    expect(sessionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        user: { connect: { id: 'user-1' } },
        refreshTokenHash: 'hashed-refresh-token',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
      }),
    );
  });

  it('generates the access and refresh tokens with the same userId/sessionId payload', async () => {
    await createSession('user-1');

    const accessPayload = vi.mocked(tokenService.generateAccessToken).mock.calls[0][0];
    const refreshPayload = vi.mocked(tokenService.generateRefreshToken).mock.calls[0][0];

    expect(accessPayload.userId).toBe('user-1');
    expect(accessPayload).toEqual(refreshPayload);
  });
});
