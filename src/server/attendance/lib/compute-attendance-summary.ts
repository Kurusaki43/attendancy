import { AttendanceCompletionStatus, AttendanceEventType } from '@/generated/prisma/enums';

const MS_PER_MINUTE = 60_000;

export type AttendanceSummaryEvent = {
  type: AttendanceEventType;
  occurredAt: Date;
};

export type AttendanceSummary = {
  firstClockIn: Date | null;
  lastClockOut: Date | null;
  workedMinutes: number;
  completionStatus: AttendanceCompletionStatus | null;
};

export function computeAttendanceSummary(events: AttendanceSummaryEvent[]): AttendanceSummary {
  if (events.length === 0) {
    return { firstClockIn: null, lastClockOut: null, workedMinutes: 0, completionStatus: null };
  }

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

  // Alternation/order are already validated before this runs, so the chronologically last event
  // alone tells us completeness: ending on Clock Out means every session closed, ending on the
  // (necessarily orphaned) Clock In means one didn't.
  const lastEvent = sorted[sorted.length - 1];
  const completionStatus =
    lastEvent.type === AttendanceEventType.CLOCK_OUT
      ? AttendanceCompletionStatus.COMPLETE
      : AttendanceCompletionStatus.INCOMPLETE;

  return { firstClockIn, lastClockOut, workedMinutes, completionStatus };
}
