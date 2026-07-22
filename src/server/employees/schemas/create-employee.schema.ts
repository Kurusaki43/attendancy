import z from 'zod';

import { isFutureDate } from '@/shared/utils/date';

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

  hireDate: z.coerce
    .date('Hire date is required.')
    .default(new Date())
    .refine((date) => !isFutureDate(date), { message: 'Hire date cannot be in the future.' }),

  gender: z.enum(['MALE', 'FEMALE']).optional(),
  birthDate: z.coerce
    .date()
    .optional()
    .refine((date) => !date || !isFutureDate(date), {
      message: 'Birth date cannot be in the future.',
    }),
  address: z.string().trim().max(255, 'Address must not exceed 255 characters.').optional(),

  departmentId: z.string().trim().optional(),
  positionId: z.string().trim().optional(),
  managerId: z.string().trim().optional(),

  employmentStatus: z.enum(['ACTIVE', 'ON_LEAVE', 'TERMINATED']).default('ACTIVE'),

  avatar: z
    .string()
    .max(AVATAR_MAX_LENGTH, 'Avatar image is too large.')
    .refine((value) => value === '' || value.startsWith('data:image/'), {
      message: 'Avatar must be an uploaded image.',
    })
    .optional(),

  locale: z.string().trim().min(1).max(35).optional(),
  timezone: z.string().trim().min(1).max(60).optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
