import z from 'zod';

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

  avatar: z.union([z.url('Please enter a valid URL.').max(2048), z.literal('')]).optional(),
});

export type UpdateProfileInput = z.input<typeof updateProfileSchema>;
