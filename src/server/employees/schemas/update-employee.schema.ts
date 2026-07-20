import z from 'zod';

const AVATAR_MAX_LENGTH = 3_000_000;

export const updateEmployeeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters.')
    .max(50, 'First name must not exceed 50 characters.')
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters.')
    .max(50, 'Last name must not exceed 50 characters.')
    .optional(),

  email: z.email('Invalid email address.').trim().toLowerCase().optional(),

  employeeCode: z
    .string()
    .trim()
    .min(2, 'Employee code must be at least 2 characters.')
    .max(20, 'Employee code must not exceed 20 characters.')
    .regex(/^[A-Za-z0-9-]+$/, 'Employee code may only contain letters, numbers, and hyphens.')
    .transform((value) => value.toUpperCase())
    .optional(),

  phone: z.string().trim().max(20, 'Phone must not exceed 20 characters.').optional(),

  hireDate: z.coerce.date().optional(),

  gender: z.enum(['MALE', 'FEMALE']).nullable().optional(),
  birthDate: z.coerce.date().nullable().optional(),
  address: z
    .string()
    .trim()
    .max(255, 'Address must not exceed 255 characters.')
    .nullable()
    .optional(),

  departmentId: z.string().trim().nullable().optional(),
  positionId: z.string().trim().nullable().optional(),
  managerId: z.string().trim().nullable().optional(),

  employmentStatus: z.enum(['ACTIVE', 'ON_LEAVE', 'TERMINATED']).optional(),

  avatar: z
    .string()
    .max(AVATAR_MAX_LENGTH, 'Avatar image is too large.')
    .refine((value) => value === '' || value.startsWith('data:image/'), {
      message: 'Avatar must be an uploaded image.',
    })
    .optional(),
});

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
