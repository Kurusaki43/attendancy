import { headers } from 'next/headers';

import { env } from '@/lib/env/env';

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const hops = env.TRUSTED_PROXY_HOPS;

  // Vercel provides the original client IP directly.
  const vercelIp = h.get('x-vercel-forwarded-for');
  if (vercelIp) {
    return vercelIp;
  }

  // Generic reverse proxy support.
  const forwardedFor = h.get('x-forwarded-for');
  if (!forwardedFor) {
    return 'unknown';
  }

  const ips = forwardedFor.split(',').map((ip) => ip.trim());

  if (hops <= 0) {
    return 'unknown';
  }

  const index = ips.length - hops - 1;

  return index >= 0 ? ips[index] : 'unknown';
}
