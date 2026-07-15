export function getClientIp(headerStore: Headers): string {
  return headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}
