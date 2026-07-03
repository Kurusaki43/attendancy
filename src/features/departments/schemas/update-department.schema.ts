import z from 'zod';

export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Department name must be at least 2 characters.')
    .max(100, 'Department name must not exceed 100 characters.')
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, 'Description must not exceed 500 characters.')
    .optional()
    .nullable(),

  isActive: z.boolean().optional(),
});

export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
