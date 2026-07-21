import { z } from 'zod';

const eventSchema = z.object({
  id: z.string().trim().min(1).optional(),
  type: z.enum(['CLOCK_IN', 'CLOCK_OUT']),
  occurredAt: z.coerce.date(),
  reason: z.string().trim().min(1, 'Notes are required for manual events.').max(500),
});

export const updateAttendanceSchema = z.object({
  events: z.array(eventSchema),
});

export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
