import { describe, expect, it } from 'vitest';

import { generateOtp, hashOtp, verifyOtp } from '@/server/auth/lib/otp';

describe('generateOtp', () => {
  it('generates a 6-digit code by default', () => {
    const code = generateOtp();

    expect(code).toMatch(/^\d{6}$/);
  });

  it('generates a code of the requested length', () => {
    const code = generateOtp(4);

    expect(code).toMatch(/^\d{4}$/);
  });

  it('generates different codes across calls (not deterministic)', () => {
    const codes = new Set(Array.from({ length: 20 }, () => generateOtp()));

    expect(codes.size).toBeGreaterThan(1);
  });
});

describe('hashOtp / verifyOtp', () => {
  it('verifies a matching code against its hash', async () => {
    const code = generateOtp();
    const hashed = await hashOtp(code);

    await expect(verifyOtp(code, hashed)).resolves.toBe(true);
  });

  it('rejects a non-matching code against a hash', async () => {
    const hashed = await hashOtp('123456');

    await expect(verifyOtp('654321', hashed)).resolves.toBe(false);
  });
});
