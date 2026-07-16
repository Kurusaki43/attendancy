import { describe, expect, it } from 'vitest';

import { verifyEmailSchema } from '@/server/auth/schemas/email-verification.schema';

describe('verifyEmailSchema', () => {
  it('accepts a valid 6-digit code', () => {
    const result = verifyEmailSchema.safeParse({ code: '123456' });

    expect(result.success).toBe(true);
  });

  it('rejects a code shorter than 6 digits', () => {
    const result = verifyEmailSchema.safeParse({ code: '123' });

    expect(result.success).toBe(false);
  });

  it('rejects a code containing non-digit characters', () => {
    const result = verifyEmailSchema.safeParse({ code: 'abcdef' });

    expect(result.success).toBe(false);
  });

  it('trims surrounding whitespace from the code', () => {
    const result = verifyEmailSchema.safeParse({ code: '  123456  ' });

    expect(result.success).toBe(true);
  });
});
