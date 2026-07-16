import { randomInt } from 'node:crypto';

import { hash, verify } from '@node-rs/argon2';

import { HASH_OPTIONS } from '@/server/auth/lib/password';

export function generateOtp(length = 6): string {
  const min = 10 ** (length - 1);
  const max = 10 ** length;

  return randomInt(min, max).toString();
}

export function hashOtp(code: string) {
  return hash(code, HASH_OPTIONS);
}

export function verifyOtp(code: string, hashedCode: string) {
  return verify(hashedCode, code, HASH_OPTIONS);
}
