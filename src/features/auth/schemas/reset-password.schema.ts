import z from 'zod';

export const resetPasswordSchema = z.object({
  id: z.string('User ID is required'),
  token: z.string('Token is required'),
  newPassword: z
    .string('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be at most 32 characters'),
});

export const resetPasswordFormSchema = resetPasswordSchema
  .extend({
    confirmPassword: z
      .string('Confirm password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must be at most 32 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;
