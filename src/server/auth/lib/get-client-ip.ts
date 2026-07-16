import { env } from '@/lib/env/env';

// Takes the Headers object explicitly (rather than calling next/headers' headers() internally)
// so this works identically in Server Actions, Route Handlers, and proxy.ts middleware — the
// latter only ever has a NextRequest's headers, not Next's async request-scoped headers().
export function getClientIp(headerStore: Headers): string {
  const hops = env.TRUSTED_PROXY_HOPS;

  // Vercel provides the original client IP directly.
  const vercelIp = headerStore.get('x-vercel-forwarded-for');
  if (vercelIp) {
    return vercelIp;
  }

  // Generic reverse proxy support.
  const forwardedFor = headerStore.get('x-forwarded-for');
  if (!forwardedFor) {
    return 'unknown';
  }

  const ips = forwardedFor.split(',').map((ip) => ip.trim());

  if (hops <= 0) {
    return 'unknown';
  }

  const index = ips.length - hops;

  return index >= 0 ? ips[index] : 'unknown';
}
