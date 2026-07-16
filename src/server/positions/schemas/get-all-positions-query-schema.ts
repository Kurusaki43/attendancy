import { z } from 'zod';

import { BaseQuerySchema } from '@/shared/types/base-query-schema';

export const positionQuerySchema = BaseQuerySchema.extend({
  isActive: z.enum(['true', 'false']).optional(),
  sort: z
    .enum(['createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'title', '-title'])
    .default('-createdAt'),
});

export type PositionQueryInput = z.infer<typeof positionQuerySchema>;
