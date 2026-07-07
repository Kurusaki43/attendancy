import { z } from 'zod';

export const BaseQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((value) => value || undefined),

  sort: z.string().optional(),
});
