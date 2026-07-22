import { z } from 'zod';

import { BaseQuerySchema } from '@/shared/types/base-query-schema';

export const attendanceQuerySchema = BaseQuerySchema.extend({
  status: z.enum(['PRESENT', 'ABSENT', 'ON_LEAVE', 'HOLIDAY']).optional(),
  completionStatus: z.enum(['COMPLETE', 'INCOMPLETE']).optional(),
  employeeId: z.string().optional(),
  departmentId: z.string().optional(),
  dateFrom: z.iso.date().optional(),
  dateTo: z.iso.date().optional(),
  sort: z
    .enum([
      'date',
      '-date',
      'createdAt',
      '-createdAt',
      'updatedAt',
      '-updatedAt',
      'workedMinutes',
      '-workedMinutes',
    ])
    .default('-date'),
});

export type AttendanceQueryInput = z.infer<typeof attendanceQuerySchema>;
