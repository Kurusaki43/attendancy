import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../../infrastructure/redis/client', () => ({
  redis: {
    get: vi.fn(),
  },
}));

const { redis } = await import('../../../../infrastructure/redis/client');
const { verifyAttendanceQrCode } = await import('../../services/verify-attendance-qr.service');
const { BadRequestError } = await import('../../../../lib/errors/bad-request.error');

describe('verifyAttendanceQrCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves when the token matches the current token stored in redis', async () => {
    vi.mocked(redis.get).mockResolvedValue('current-token');

    await expect(verifyAttendanceQrCode('current-token')).resolves.toEqual({ valid: true });
  });

  it('throws when the token does not match the current token stored in redis', async () => {
    vi.mocked(redis.get).mockResolvedValue('current-token');

    await expect(verifyAttendanceQrCode('stale-token')).rejects.toThrow(BadRequestError);
  });

  it('throws when there is no current token stored in redis', async () => {
    vi.mocked(redis.get).mockResolvedValue(null);

    await expect(verifyAttendanceQrCode('any-token')).rejects.toThrow(BadRequestError);
  });
});
