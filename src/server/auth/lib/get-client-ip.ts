import { env } from '@/lib/env/env';

// x-forwarded-for grows by each hop *appending* the peer address it saw to the end of whatever
// list it received — so only the last N entries were actually written by our own infrastructure;
// anything before that (including a client-forged prefix) is untrustworthy. Trusting the first
// entry unconditionally (as a naive `.split(',')[0]` does) lets a client set its own IP outright.
// TRUSTED_PROXY_HOPS pins how many trusted hops are in front of this app; with 0 (the default),
// the header is never trusted at all.
export function getClientIp(headerStore: Headers): string {
  const hops = env.TRUSTED_PROXY_HOPS;

  if (hops <= 0) {
    return 'unknown';
  }

  const forwardedFor = headerStore.get('x-forwarded-for');

  if (!forwardedFor) {
    return 'unknown';
  }

  const ips = forwardedFor.split(',').map((ip) => ip.trim());
  const trustedIp = ips[ips.length - hops];

  return trustedIp || 'unknown';
}
