import { z } from 'zod';

export const verifyEmailSchema = z.object({
  userId: z
    .string({
      error: 'User ID is required',
    })
    .min(1, { message: 'User ID cannot be empty' })
    .regex(/^c[a-z0-9]{24,}$/i, {
      message: 'Invalid user identifier format',
    }),
  code: z
    .string()
    .trim()
    .length(6, 'Verification code must be 6 digits.')
    .regex(/^\d+$/, 'Verification code must contain only numbers.'),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
