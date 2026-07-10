import { describe, expect, it } from 'vitest';

import { registerFormSchema, registerSchema } from '@/server/auth/schemas/register.schema';

const validInput = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  password: 'password123',
  captchaToken: 'captcha-token',
};

describe('registerSchema', () => {
  it('accepts valid registration input', () => {
    expect(registerSchema.safeParse(validInput).success).toBe(true);
  });

  it('rejects a first name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...validInput, firstName: 'A' });

    expect(result.success).toBe(false);
  });

  it('trims whitespace-only names down before length validation', () => {
    const result = registerSchema.safeParse({ ...validInput, firstName: '  A ' });

    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({ ...validInput, email: 'not-an-email' });

    expect(result.success).toBe(false);
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({ ...validInput, password: 'short' });

    expect(result.success).toBe(false);
  });

  it('rejects a missing captcha token', () => {
    const result = registerSchema.safeParse({ ...validInput, captchaToken: '' });

    expect(result.success).toBe(false);
  });
});

describe('registerFormSchema', () => {
  it('accepts matching password and confirmPassword', () => {
    const result = registerFormSchema.safeParse({
      ...validInput,
      confirmPassword: 'password123',
    });

    expect(result.success).toBe(true);
  });

  it('rejects mismatched password and confirmPassword', () => {
    const result = registerFormSchema.safeParse({
      ...validInput,
      confirmPassword: 'different-password',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['confirmPassword']);
    }
  });
});
