import type { AttendanceMethod } from '@/generated/prisma/enums';
import { AttendanceEventType, AttendanceStatus } from '@/generated/prisma/enums';
import {
  attendanceRepository,
  type AttendanceWithEvents,
} from '@/server/attendance/repositories/attendance.repository';
import { attendanceEventRepository } from '@/server/attendance/repositories/attendance-event.repository';

export async function clockIn(
  attendance: AttendanceWithEvents,
  method: AttendanceMethod,
): Promise<AttendanceWithEvents> {
  const occurredAt = new Date();

  await attendanceEventRepository.create({
    attendanceId: attendance.id,
    type: AttendanceEventType.CLOCK_IN,
    occurredAt,
    method,
  });

  return attendanceRepository.update(attendance.id, {
    status: AttendanceStatus.PRESENT,
    firstClockIn: attendance.firstClockIn ?? occurredAt,
  });
}
