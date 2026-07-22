import { z } from 'zod';

const eventSchema = z.object({
  type: z.enum(['CLOCK_IN', 'CLOCK_OUT']),
  occurredAt: z.coerce.date(),
  reason: z.string().trim().max(500).optional(),
});

export const createAttendanceSchema = z.object({
  employeeId: z.string().trim().min(1, 'Employee is required.'),
  date: z.iso.date('Date is required.'),
  events: z.array(eventSchema).min(1, 'At least one attendance event is required.'),
});

export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
