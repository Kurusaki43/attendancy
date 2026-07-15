import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../../infrastructure/rate-limit/rate-limiter', () => ({
  checkRateLimit: vi.fn(),
}));

const { checkRateLimit } = await import('../../../../infrastructure/rate-limit/rate-limiter');
const { TooManyRequestsError } = await import('@/lib/errors/too-many-requests.error');
const { ERROR_CODES } = await import('@/lib/errors/error-codes');
const { requireRateLimit } = await import('../../guards/require-rate-limit');

describe('requireRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves when the request is within the limit', async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 4, retryAfterMs: 0 });

    await expect(
      requireRateLimit({ key: 'login:ip:1.2.3.4', limit: 5, windowMs: 60_000 }),
    ).resolves.toBeUndefined();
  });

  it('throws TooManyRequestsError once the limit is exceeded', async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: false,
      remaining: 0,
      retryAfterMs: 30_000,
    });

    const promise = requireRateLimit({ key: 'login:ip:1.2.3.4', limit: 5, windowMs: 60_000 });

    await expect(promise).rejects.toBeInstanceOf(TooManyRequestsError);
    await expect(promise).rejects.toMatchObject({
      code: ERROR_CODES.TOO_MANY_REQUESTS,
      message: expect.stringContaining('00:00:30'),
    });
  });

  it('formats the wait time as HH:MM:SS once it crosses a minute', async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: false,
      remaining: 0,
      retryAfterMs: 125_000,
    });

    const promise = requireRateLimit({ key: 'login:ip:1.2.3.4', limit: 5, windowMs: 60_000 });

    await expect(promise).rejects.toMatchObject({ message: expect.stringContaining('00:02:05') });
  });

  it('formats the wait time as HH:MM:SS once it crosses an hour', async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: false,
      remaining: 0,
      retryAfterMs: 3_665_000,
    });

    const promise = requireRateLimit({ key: 'login:ip:1.2.3.4', limit: 5, windowMs: 60_000 });

    await expect(promise).rejects.toMatchObject({ message: expect.stringContaining('01:01:05') });
  });

  it('never reports a zero-length wait for a sub-second remainder', async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: false,
      remaining: 0,
      retryAfterMs: 400,
    });

    const promise = requireRateLimit({ key: 'login:ip:1.2.3.4', limit: 5, windowMs: 60_000 });

    await expect(promise).rejects.toMatchObject({ message: expect.stringContaining('00:00:01') });
  });
});
