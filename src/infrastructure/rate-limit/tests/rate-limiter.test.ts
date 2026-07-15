import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../redis/client', () => ({
  redis: {
    eval: vi.fn(),
  },
}));

const { redis } = await import('../../redis/client');
const { checkRateLimit } = await import('../rate-limiter');

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows the request while under the limit', async () => {
    vi.mocked(redis.eval).mockResolvedValue([3, 60_000]);

    const result = await checkRateLimit({ key: 'login:ip:1.2.3.4', limit: 5, windowMs: 60_000 });

    expect(result).toEqual({ allowed: true, remaining: 2, retryAfterMs: 0 });
  });

  it('blocks the request once the count exceeds the limit', async () => {
    vi.mocked(redis.eval).mockResolvedValue([6, 45_000]);

    const result = await checkRateLimit({ key: 'login:ip:1.2.3.4', limit: 5, windowMs: 60_000 });

    expect(result).toEqual({ allowed: false, remaining: 0, retryAfterMs: 45_000 });
  });

  it('allows the request exactly at the limit boundary', async () => {
    vi.mocked(redis.eval).mockResolvedValue([5, 60_000]);

    const result = await checkRateLimit({ key: 'login:ip:1.2.3.4', limit: 5, windowMs: 60_000 });

    expect(result).toEqual({ allowed: true, remaining: 0, retryAfterMs: 0 });
  });

  it('namespaces the redis key and passes the window as the script argument', async () => {
    vi.mocked(redis.eval).mockResolvedValue([1, 60_000]);

    await checkRateLimit({ key: 'login:ip:1.2.3.4', limit: 5, windowMs: 60_000 });

    expect(redis.eval).toHaveBeenCalledWith(
      expect.any(String),
      1,
      'rate-limit:login:ip:1.2.3.4',
      60_000,
    );
  });
});
