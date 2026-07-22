import { z } from 'zod';

import { BaseQuerySchema } from '@/shared/types/base-query-schema';

export const employeeQuerySchema = BaseQuerySchema.extend({
  employmentStatus: z.enum(['ACTIVE', 'TERMINATED']).optional(),
  accountStatus: z.enum(['ACTIVE', 'INACTIVE', 'INVITED', 'SUSPENDED']).optional(),
  departmentId: z.string().optional(),
  positionId: z.string().optional(),
  sort: z
    .enum([
      'createdAt',
      '-createdAt',
      'updatedAt',
      '-updatedAt',
      'hireDate',
      '-hireDate',
      'employeeCode',
      '-employeeCode',
      'name',
      '-name',
    ])
    .default('-createdAt'),
});

export type EmployeeQueryInput = z.infer<typeof employeeQuerySchema>;
