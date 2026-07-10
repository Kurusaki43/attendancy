import { z } from 'zod';

import { BaseQuerySchema } from '@/shared/types/base-query-schema';

export const departmentQuerySchema = BaseQuerySchema.extend({
  isActive: z.enum(['true', 'false']).optional(),
  sort: z
    .enum(['createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'name', '-name'])
    .default('-createdAt'),
});

export type DepartmentQueryInput = z.infer<typeof departmentQuerySchema>;
