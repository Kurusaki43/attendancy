import z from 'zod';

// Generous ceiling for a base64-encoded 500x500 JPEG (the client crops/compresses to that size
// before submitting) — this is a defense-in-depth check, not the primary size gate, which is the
// 1MB raw-upload limit enforced client-side before cropping.
const AVATAR_MAX_LENGTH = 3_000_000;

export const createEmployeeSchema = z.object({
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

  email: z.email('Invalid email address.').trim().toLowerCase(),

  employeeCode: z
    .string()
    .trim()
    .min(2, 'Employee code must be at least 2 characters.')
    .max(20, 'Employee code must not exceed 20 characters.')
    .regex(/^[A-Za-z0-9-]+$/, 'Employee code may only contain letters, numbers, and hyphens.')
    .transform((value) => value.toUpperCase()),

  phone: z.string().trim().max(20, 'Phone must not exceed 20 characters.').optional(),

  hireDate: z.coerce.date('Hire date is required.').default(new Date()),

  gender: z.enum(['MALE', 'FEMALE']).optional(),
  birthDate: z.coerce.date().optional(),
  address: z.string().trim().max(255, 'Address must not exceed 255 characters.').optional(),

  departmentId: z.string().trim().optional(),
  positionId: z.string().trim().optional(),
  managerId: z.string().trim().optional(),

  employmentStatus: z.enum(['ACTIVE', 'ON_LEAVE', 'TERMINATED']).default('ACTIVE'),

  // Only ever an uploaded image (data URI) or omitted — there is no free-text URL input.
  avatar: z
    .string()
    .max(AVATAR_MAX_LENGTH, 'Avatar image is too large.')
    .refine((value) => value === '' || value.startsWith('data:image/'), {
      message: 'Avatar must be an uploaded image.',
    })
    .optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
