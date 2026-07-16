import z from 'zod';

export const updatePositionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Position title must be at least 2 characters.')
    .max(100, 'Position title must not exceed 100 characters.')
    .optional(),

  code: z
    .string()
    .trim()
    .min(2, 'Position code must be at least 2 characters.')
    .max(10, 'Position code must not exceed 10 characters.')
    .regex(/^[A-Za-z0-9-]+$/, 'Position code may only contain letters, numbers, and hyphens.')
    .transform((value) => value.toUpperCase())
    .optional(),

  description: z.string().trim().max(500, 'Description must not exceed 500 characters.').optional(),
  isActive: z.boolean().optional(),
});

export type UpdatePositionInput = z.input<typeof updatePositionSchema>;
