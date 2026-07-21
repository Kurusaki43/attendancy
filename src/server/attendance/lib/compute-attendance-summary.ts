import { AttendanceEventType } from '@/generated/prisma/enums';

const MS_PER_MINUTE = 60_000;

export type AttendanceSummaryEvent = {
  type: AttendanceEventType;
  occurredAt: Date;
};

export type AttendanceSummary = {
  firstClockIn: Date | null;
  lastClockOut: Date | null;
  workedMinutes: number;
};

export function computeAttendanceSummary(events: AttendanceSummaryEvent[]): AttendanceSummary {
  const sorted = [...events].sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());

  let firstClockIn: Date | null = null;
  let lastClockOut: Date | null = null;
  let workedMinutes = 0;
  let openClockIn: Date | null = null;

  for (const event of sorted) {
    if (event.type === AttendanceEventType.CLOCK_IN) {
      firstClockIn ??= event.occurredAt;
      openClockIn = event.occurredAt;
    } else {
      lastClockOut = event.occurredAt;

      if (openClockIn) {
        workedMinutes += Math.round(
          (event.occurredAt.getTime() - openClockIn.getTime()) / MS_PER_MINUTE,
        );
        openClockIn = null;
      }
    }
  }

  return { firstClockIn, lastClockOut, workedMinutes };
}
