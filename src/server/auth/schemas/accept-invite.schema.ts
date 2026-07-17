import z from 'zod';

export const acceptInviteSchema = z.object({
  id: z.string('Invite ID is required'),
  token: z.string('Token is required'),
  password: z
    .string('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be at most 32 characters'),
});

export const acceptInviteFormSchema = acceptInviteSchema
  .extend({
    confirmPassword: z
      .string('Confirm password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must be at most 32 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  });

export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
export type AcceptInviteFormInput = z.infer<typeof acceptInviteFormSchema>;
