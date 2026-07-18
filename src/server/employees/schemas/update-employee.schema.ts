import z from 'zod';

// Generous ceiling for a base64-encoded 500x500 JPEG (the client crops/compresses to that size
// before submitting) — this is a defense-in-depth check, not the primary size gate, which is the
// 1MB raw-upload limit enforced client-side before cropping.
const AVATAR_MAX_LENGTH = 3_000_000;

export const updateEmployeeSchema = z.object({
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

  // Only ever an uploaded image (data URI) or '' to clear it — there is no free-text URL input.
  // An unchanged existing avatar is simply omitted from the submitted payload by the form.
  avatar: z
    .string()
    .max(AVATAR_MAX_LENGTH, 'Avatar image is too large.')
    .refine((value) => value === '' || value.startsWith('data:image/'), {
      message: 'Avatar must be an uploaded image.',
    })
    .optional(),
});

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
