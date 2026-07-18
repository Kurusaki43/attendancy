import type { StringValue } from 'ms';
import ms from 'ms';

export function humanizeDuration(value: StringValue): string {
  return ms(ms(value), { long: true });
}
