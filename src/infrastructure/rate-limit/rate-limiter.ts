import { redis } from '@/infrastructure/redis/client';

// Atomic fixed-window counter: increment, and only set the window's expiry on the first hit in
// that window. Doing this as two separate round trips (INCR then EXPIRE) would let a request that
// crashes/times out between them leave the key without a TTL, so it never resets.
const INCREMENT_SCRIPT = `
local current = redis.call('INCR', KEYS[1])
if current == 1 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
end
return { current, redis.call('PTTL', KEYS[1]) }
`;

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export async function checkRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const redisKey = `rate-limit:${key}`;

  const [current, ttl] = (await redis.eval(INCREMENT_SCRIPT, 1, redisKey, windowMs)) as [
    number,
    number,
  ];

  const allowed = current <= limit;

  return {
    allowed,
    remaining: Math.max(limit - current, 0),
    retryAfterMs: allowed ? 0 : Math.max(ttl, 0),
  };
}
