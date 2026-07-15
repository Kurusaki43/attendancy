import { describe, expect, it } from 'vitest';

import { updateProfileSchema } from '@/server/profile/schemas/update-profile.schema';

describe('updateProfileSchema', () => {
  it('accepts valid input', () => {
    const result = updateProfileSchema.safeParse({
      firstName: 'Ada',
      lastName: 'Lovelace',
      avatar: 'https://example.com/avatar.png',
    });

    expect(result.success).toBe(true);
  });

  it('accepts input without an avatar', () => {
    const result = updateProfileSchema.safeParse({
      firstName: 'Ada',
      lastName: 'Lovelace',
    });

    expect(result.success).toBe(true);
  });

  it('accepts an empty string avatar to allow clearing it', () => {
    const result = updateProfileSchema.safeParse({
      firstName: 'Ada',
      lastName: 'Lovelace',
      avatar: '',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a first name shorter than 2 characters', () => {
    const result = updateProfileSchema.safeParse({
      firstName: 'A',
      lastName: 'Lovelace',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an avatar that is not a valid URL', () => {
    const result = updateProfileSchema.safeParse({
      firstName: 'Ada',
      lastName: 'Lovelace',
      avatar: 'not-a-url',
    });

    expect(result.success).toBe(false);
  });
});
