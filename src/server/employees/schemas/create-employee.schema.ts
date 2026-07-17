import z from 'zod';

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

  departmentId: z.string().trim().optional(),
  positionId: z.string().trim().optional(),
  managerId: z.string().trim().optional(),

  isActive: z.boolean().default(true),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
