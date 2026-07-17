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

  icon: z.string().trim().max(50, 'Icon must not exceed 50 characters.').optional(),

  color: z.string().trim().max(50, 'Color must not exceed 50 characters.').optional(),

  parentId: z.cuid2('Invalid parent department.').optional(),

  isActive: z.boolean().default(true),
});

export type CreateDepartmentInput = z.input<typeof createDepartmentSchema>;
