import { checkRateLimit } from '@/infrastructure/rate-limit/rate-limiter';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { TooManyRequestsError } from '@/lib/errors/too-many-requests.error';

export interface RequireRateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

function formatRetryAfter(retryAfterMs: number): string {
  const totalSeconds = Math.max(Math.ceil(retryAfterMs / 1000), 1);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((unit) => String(unit).padStart(2, '0')).join(':');
}

export async function requireRateLimit({ key, limit, windowMs }: RequireRateLimitOptions) {
  const { allowed, retryAfterMs } = await checkRateLimit({ key, limit, windowMs });

  if (!allowed) {
    throw new TooManyRequestsError(
      ERROR_CODES.TOO_MANY_REQUESTS,
      `Too many attempts. Please try again in ${formatRetryAfter(retryAfterMs)}.`,
    );
  }
}

// getClientIp() falls back to 'unknown' when TRUSTED_PROXY_HOPS isn't configured or the header
// is missing/short — enforcing a keyed limit on that literal string would lump every such client
// into one shared bucket, letting one of them exhaust it and lock out the rest. Skip IP-based
// enforcement in that case; the accompanying per-email/per-user requireRateLimit call still
// bounds abuse per identity.
export async function requireIpRateLimit(ipAddress: string, options: RequireRateLimitOptions) {
  if (ipAddress === 'unknown') {
    return;
  }

  await requireRateLimit(options);
}
