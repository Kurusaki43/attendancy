import { z } from 'zod';

import { ATTENDANCE_STATUSES } from '@/features/attendance/lib/attendance-status';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const eventFormSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['CLOCK_IN', 'CLOCK_OUT']),
  time: z.string().regex(TIME_REGEX, 'Enter a valid time.'),
  reason: z.string().trim().min(1, 'Notes are required.').max(500),
});

export const createAttendanceFormSchema = z.object({
  employeeId: z.string().trim().min(1, 'Employee is required.'),
  date: z.date('Date is required.'),
  events: z.array(eventFormSchema).min(1, 'At least one attendance event is required.'),
});

export const updateAttendanceFormSchema = z.object({
  status: z.enum(ATTENDANCE_STATUSES),
  events: z.array(eventFormSchema),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
export type CreateAttendanceFormValues = z.infer<typeof createAttendanceFormSchema>;
export type UpdateAttendanceFormValues = z.infer<typeof updateAttendanceFormSchema>;
export type AttendanceFormValues = CreateAttendanceFormValues | UpdateAttendanceFormValues;

/** Combines a picked calendar date with an 'HH:MM' time-of-day into a local-time Date instant. */
export function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

/** Formats a Date as an 'HH:MM' local time-of-day string for a native time input's value. */
export function toTimeInputValue(date: Date | null | undefined): string {
  if (!date) return '';
  const value = new Date(date);
  return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
}

export type FormAttendanceSummary = {
  firstClockIn: Date | null;
  lastClockOut: Date | null;
  workedMinutes: number;
};

export function computeFormSummary(
  date: Date | undefined,
  events: EventFormValues[],
): FormAttendanceSummary {
  if (!date) return { firstClockIn: null, lastClockOut: null, workedMinutes: 0 };

  const sorted = events
    .filter((event) => TIME_REGEX.test(event.time))
    .map((event) => ({ type: event.type, occurredAt: combineDateAndTime(date, event.time) }))
    .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());

  let firstClockIn: Date | null = null;
  let lastClockOut: Date | null = null;
  let workedMinutes = 0;
  let openClockIn: Date | null = null;

  for (const event of sorted) {
    if (event.type === 'CLOCK_IN') {
      firstClockIn ??= event.occurredAt;
      openClockIn = event.occurredAt;
    } else {
      lastClockOut = event.occurredAt;

      if (openClockIn) {
        workedMinutes += Math.round((event.occurredAt.getTime() - openClockIn.getTime()) / 60_000);
        openClockIn = null;
      }
    }
  }

  return { firstClockIn, lastClockOut, workedMinutes };
}
