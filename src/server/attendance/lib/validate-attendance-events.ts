import { AttendanceEventType } from '@/generated/prisma/enums';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { startOfUtcDay } from '@/shared/utils/date';

const MAX_EVENTS_PER_DAY = 20;

export type AttendanceEventInput = {
  type: AttendanceEventType;
  occurredAt: Date;
};

export function validateAttendanceEvents(events: AttendanceEventInput[], date: Date): void {
  if (events.length === 0) {
    throw new BadRequestError(
      ERROR_CODES.ATTENDANCE_EVENTS_REQUIRED,
      'At least one attendance event is required.',
    );
  }

  if (events.length > MAX_EVENTS_PER_DAY) {
    throw new BadRequestError(
      ERROR_CODES.ATTENDANCE_TOO_MANY_EVENTS,
      `No more than ${MAX_EVENTS_PER_DAY} attendance events are allowed per day.`,
    );
  }

  const sorted = [...events].sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());

  sorted.forEach((event, index) => {
    if (startOfUtcDay(event.occurredAt).getTime() !== date.getTime()) {
      throw new BadRequestError(
        ERROR_CODES.ATTENDANCE_EVENT_OUTSIDE_DATE,
        'All attendance events must occur on the selected attendance date.',
      );
    }

    if (index > 0 && sorted[index - 1].occurredAt.getTime() === event.occurredAt.getTime()) {
      throw new BadRequestError(
        ERROR_CODES.ATTENDANCE_DUPLICATE_EVENT_TIME,
        'Attendance events cannot share the same timestamp.',
      );
    }

    const expectedType =
      index % 2 === 0 ? AttendanceEventType.CLOCK_IN : AttendanceEventType.CLOCK_OUT;

    if (event.type !== expectedType) {
      throw new BadRequestError(
        ERROR_CODES.ATTENDANCE_EVENTS_NOT_ALTERNATING,
        'Attendance events must start with a clock in and alternate between clock in and clock out.',
      );
    }
  });
}
