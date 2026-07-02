import { randomInt } from 'node:crypto';

import { hash, verify } from '@node-rs/argon2';

export function generateOtp(length = 6): string {
  const min = 10 ** (length - 1);
  const max = 10 ** length;

  return randomInt(min, max).toString();
}

export function hashOtp(code: string) {
  return hash(code);
}

export function verifyOtp(code: string, hashedCode: string) {
  return verify(hashedCode, code);
}
