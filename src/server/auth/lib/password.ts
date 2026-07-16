import { hash, verify } from '@node-rs/argon2';

export const HASH_OPTIONS = {
  algorithm: 2,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(password: string) {
  return hash(password, HASH_OPTIONS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return verify(passwordHash, password, HASH_OPTIONS);
}
