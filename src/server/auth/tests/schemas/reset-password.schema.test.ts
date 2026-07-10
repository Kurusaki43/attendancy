import { describe, expect, it } from 'vitest';

import { resetPasswordFormSchema, resetPasswordSchema } from '@/server/auth/schemas/reset-password.schema';

describe('resetPasswordSchema', () => {
  it('accepts valid input', () => {
    const result = resetPasswordSchema.safeParse({
      id: 'otp-id',
      token: 'reset-token',
      newPassword: 'password123',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = resetPasswordSchema.safeParse({
      id: 'otp-id',
      token: 'reset-token',
      newPassword: 'short',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a password longer than 32 characters', () => {
    const result = resetPasswordSchema.safeParse({
      id: 'otp-id',
      token: 'reset-token',
      newPassword: 'a'.repeat(33),
    });

    expect(result.success).toBe(false);
  });

  it('rejects a missing token', () => {
    const result = resetPasswordSchema.safeParse({
      id: 'otp-id',
      newPassword: 'password123',
    });

    expect(result.success).toBe(false);
  });
});

describe('resetPasswordFormSchema', () => {
  it('accepts matching newPassword and confirmPassword', () => {
    const result = resetPasswordFormSchema.safeParse({
      id: 'otp-id',
      token: 'reset-token',
      newPassword: 'password123',
      confirmPassword: 'password123',
    });

    expect(result.success).toBe(true);
  });

  it('rejects mismatched newPassword and confirmPassword', () => {
    const result = resetPasswordFormSchema.safeParse({
      id: 'otp-id',
      token: 'reset-token',
      newPassword: 'password123',
      confirmPassword: 'different-password',
    });

    expect(result.success).toBe(false);
  });
});
