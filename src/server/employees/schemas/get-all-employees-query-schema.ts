import { z } from 'zod';

import { BaseQuerySchema } from '@/shared/types/base-query-schema';

export const employeeQuerySchema = BaseQuerySchema.extend({
  isActive: z.enum(['true', 'false']).optional(),
  departmentId: z.string().optional(),
  positionId: z.string().optional(),
  sort: z
    .enum(['createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'hireDate', '-hireDate'])
    .default('-createdAt'),
});

export type EmployeeQueryInput = z.infer<typeof employeeQuerySchema>;
