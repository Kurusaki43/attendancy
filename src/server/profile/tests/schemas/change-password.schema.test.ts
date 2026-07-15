import { describe, expect, it } from 'vitest';

import {
  changePasswordFormSchema,
  changePasswordSchema,
} from '@/server/profile/schemas/change-password.schema';

describe('changePasswordSchema', () => {
  it('accepts valid input', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'old-password',
      newPassword: 'new-password123',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a missing current password', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: '',
      newPassword: 'new-password123',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a new password shorter than 8 characters', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'old-password',
      newPassword: 'short',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a new password longer than 32 characters', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'old-password',
      newPassword: 'a'.repeat(33),
    });

    expect(result.success).toBe(false);
  });
});

describe('changePasswordFormSchema', () => {
  it('accepts matching newPassword and confirmPassword', () => {
    const result = changePasswordFormSchema.safeParse({
      currentPassword: 'old-password',
      newPassword: 'new-password123',
      confirmPassword: 'new-password123',
    });

    expect(result.success).toBe(true);
  });

  it('rejects mismatched newPassword and confirmPassword', () => {
    const result = changePasswordFormSchema.safeParse({
      currentPassword: 'old-password',
      newPassword: 'new-password123',
      confirmPassword: 'different-password',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a new password equal to the current password', () => {
    const result = changePasswordFormSchema.safeParse({
      currentPassword: 'same-password',
      newPassword: 'same-password',
      confirmPassword: 'same-password',
    });

    expect(result.success).toBe(false);
  });
});
