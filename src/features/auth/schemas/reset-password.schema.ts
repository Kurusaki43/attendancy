import z from 'zod';

export const resetPasswordSchema = z.object({
  id: z.string(),
  token: z.string().max(32),
  newPassword: z.string().min(8).max(32),
});

export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
