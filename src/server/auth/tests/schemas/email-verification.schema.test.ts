import { describe, expect, it } from 'vitest';

import { verifyEmailSchema } from '@/server/auth/schemas/email-verification.schema';

const validUserId = `c${'a'.repeat(24)}`;

describe('verifyEmailSchema', () => {
  it('accepts a valid userId and 6-digit code', () => {
    const result = verifyEmailSchema.safeParse({ userId: validUserId, code: '123456' });

    expect(result.success).toBe(true);
  });

  it('rejects a userId that does not match the expected cuid-like format', () => {
    const result = verifyEmailSchema.safeParse({ userId: 'not-a-valid-id', code: '123456' });

    expect(result.success).toBe(false);
  });

  it('rejects a code shorter than 6 digits', () => {
    const result = verifyEmailSchema.safeParse({ userId: validUserId, code: '123' });

    expect(result.success).toBe(false);
  });

  it('rejects a code containing non-digit characters', () => {
    const result = verifyEmailSchema.safeParse({ userId: validUserId, code: 'abcdef' });

    expect(result.success).toBe(false);
  });

  it('trims surrounding whitespace from the code', () => {
    const result = verifyEmailSchema.safeParse({ userId: validUserId, code: '  123456  ' });

    expect(result.success).toBe(true);
  });
});
