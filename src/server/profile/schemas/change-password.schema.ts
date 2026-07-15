import z from 'zod';

export const changePasswordSchema = z.object({
  currentPassword: z
    .string('Current password is required.')
    .min(1, 'Current password is required.'),

  newPassword: z
    .string('New password is required.')
    .min(8, 'Password must be at least 8 characters.')
    .max(32, 'Password must be at most 32 characters.'),
});

export const changePasswordFormSchema = changePasswordSchema
  .extend({
    confirmPassword: z
      .string('Confirm password is required.')
      .min(1, 'Confirm password is required.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from your current password.',
    path: ['newPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ChangePasswordFormInput = z.infer<typeof changePasswordFormSchema>;
