import type { AttendanceMethod } from '@/generated/prisma/enums';
import { AttendanceCompletionStatus, AttendanceEventType } from '@/generated/prisma/enums';
import type { AttendanceEventModel } from '@/generated/prisma/models';
import {
  attendanceRepository,
  type AttendanceWithEvents,
} from '@/server/attendance/repositories/attendance.repository';
import { attendanceEventRepository } from '@/server/attendance/repositories/attendance-event.repository';

const MS_PER_MINUTE = 60_000;

export async function clockOut(
  attendance: AttendanceWithEvents,
  lastClockInEvent: AttendanceEventModel,
  method: AttendanceMethod,
): Promise<AttendanceWithEvents> {
  const occurredAt = new Date();

  await attendanceEventRepository.create({
    attendanceId: attendance.id,
    type: AttendanceEventType.CLOCK_OUT,
    occurredAt,
    method,
  });

  const sessionMinutes = Math.round(
    (occurredAt.getTime() - lastClockInEvent.occurredAt.getTime()) / MS_PER_MINUTE,
  );

  return attendanceRepository.update(attendance.id, {
    lastClockOut: occurredAt,
    workedMinutes: attendance.workedMinutes + sessionMinutes,
    completionStatus: AttendanceCompletionStatus.COMPLETE,
  });
}
