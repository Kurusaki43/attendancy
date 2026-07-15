import z from 'zod';

// Generous ceiling for a base64-encoded 500x500 JPEG (the client crops/compresses to that size
// before submitting) — this is a defense-in-depth check, not the primary size gate, which is the
// 1MB raw-upload limit enforced client-side before cropping.
const AVATAR_MAX_LENGTH = 3_000_000;

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters.')
    .max(50, 'First name must not exceed 50 characters.'),

  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters.')
    .max(50, 'Last name must not exceed 50 characters.'),

  avatar: z
    .string()
    .max(AVATAR_MAX_LENGTH, 'Avatar image is too large.')
    .refine(
      (value) => value === '' || value.startsWith('data:image/') || /^https?:\/\//.test(value),
      { message: 'Avatar must be an uploaded image.' },
    )
    .optional(),
});

export type UpdateProfileInput = z.input<typeof updateProfileSchema>;
