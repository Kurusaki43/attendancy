import { afterEach, describe, expect, it } from 'vitest';

import { env } from '@/lib/env/env';
import { getClientIp } from '@/server/auth/lib/get-client-ip';

function headersFrom(xForwardedFor?: string): Headers {
  const headers = new Headers();
  if (xForwardedFor) headers.set('x-forwarded-for', xForwardedFor);
  return headers;
}

describe('getClientIp', () => {
  const originalHops = env.TRUSTED_PROXY_HOPS;

  afterEach(() => {
    env.TRUSTED_PROXY_HOPS = originalHops;
  });

  it('returns unknown when no proxy hops are trusted (default)', () => {
    env.TRUSTED_PROXY_HOPS = 0;

    expect(getClientIp(headersFrom('1.2.3.4'))).toBe('unknown');
  });

  it('returns unknown when the header is missing, even with hops trusted', () => {
    env.TRUSTED_PROXY_HOPS = 1;

    expect(getClientIp(headersFrom())).toBe('unknown');
  });

  it('trusts the last entry when one proxy hop is configured', () => {
    env.TRUSTED_PROXY_HOPS = 1;

    // The client forges a "6.6.6.6" prefix; the one trusted proxy appends the real peer IP.
    expect(getClientIp(headersFrom('6.6.6.6, 9.9.9.9'))).toBe('9.9.9.9');
  });

  it('trusts the second-to-last entry when two proxy hops are configured', () => {
    env.TRUSTED_PROXY_HOPS = 2;

    expect(getClientIp(headersFrom('6.6.6.6, 203.0.113.5, 10.0.0.1'))).toBe('203.0.113.5');
  });

  it('falls back to unknown when there are fewer entries than trusted hops', () => {
    env.TRUSTED_PROXY_HOPS = 3;

    expect(getClientIp(headersFrom('9.9.9.9'))).toBe('unknown');
  });

  it('trims whitespace around entries', () => {
    env.TRUSTED_PROXY_HOPS = 1;

    expect(getClientIp(headersFrom('6.6.6.6 ,  9.9.9.9  '))).toBe('9.9.9.9');
  });
});
