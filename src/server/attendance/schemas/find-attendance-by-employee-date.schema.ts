import { z } from 'zod';

export const findAttendanceByEmployeeDateSchema = z.object({
  employeeId: z.string().trim().min(1, 'Employee is required.'),
  date: z.iso.date('Date is required.'),
});

export type FindAttendanceByEmployeeDateInput = z.infer<typeof findAttendanceByEmployeeDateSchema>;
