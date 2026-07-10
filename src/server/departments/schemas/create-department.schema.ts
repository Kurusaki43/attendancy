import z from 'zod';

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Department name must be at least 2 characters.')
    .max(100, 'Department name must not exceed 100 characters.'),

  code: z
    .string()
    .trim()
    .min(2, 'Department code must be at least 2 characters.')
    .max(10, 'Department code must not exceed 10 characters.')
    .regex(/^[A-Za-z0-9-]+$/, 'Department code may only contain letters, numbers, and hyphens.')
    .transform((value) => value.toUpperCase()),

  description: z.string().trim().max(500, 'Description must not exceed 500 characters.').optional(),

  isActive: z.boolean().default(true),
});

export type CreateDepartmentInput = z.input<typeof createDepartmentSchema>;
