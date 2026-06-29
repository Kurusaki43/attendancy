import z from 'zod';

export const emailVerificationSchema = z.object({
  code: z.string().length(6, 'verification code should be 6 digit'),
});

export type emailVerificationInput = z.infer<typeof emailVerificationSchema>;
