import { z } from 'zod';

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, 'Verification code must be 6 digits.')
    .regex(/^\d+$/, 'Verification code must contain only numbers.'),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
