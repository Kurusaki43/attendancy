import z from 'zod';

export const scanAttendanceSchema = z.object({
  token: z.string().trim().min(1, 'A QR token is required.'),
});

export type ScanAttendanceInput = z.input<typeof scanAttendanceSchema>;
