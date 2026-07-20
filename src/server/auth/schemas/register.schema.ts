import z from 'zod';

export const registerSchema = z.object({
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

  email: z.email('Please enter a valid email address.'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(100, 'Password must not exceed 100 characters.'),
  captchaToken: z.string().min(1, 'Please complete the captcha'),

  // Detected client-side from the browser (Intl API) — optional so a missing/failed detection
  // falls back to the User model's own schema defaults instead of failing registration.
  locale: z.string().trim().min(1).max(35).optional(),
  timezone: z.string().trim().min(1).max(60).optional(),
});

export const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterFormInput = z.infer<typeof registerFormSchema>;
