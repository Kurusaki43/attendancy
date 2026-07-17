import z from 'zod';

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

  departmentId: z.string().trim().nullable().optional(),
  positionId: z.string().trim().nullable().optional(),
  managerId: z.string().trim().nullable().optional(),

  isActive: z.boolean().optional(),
});

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
