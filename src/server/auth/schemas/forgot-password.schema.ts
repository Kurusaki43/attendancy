import z from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.email('Please provide valid email format'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
