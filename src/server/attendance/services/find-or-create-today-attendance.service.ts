import { AttendanceStatus } from '@/generated/prisma/enums';
import {
  attendanceRepository,
  type AttendanceWithEvents,
} from '@/server/attendance/repositories/attendance.repository';
import { startOfUtcDay } from '@/shared/utils/date';

export async function findOrCreateTodayAttendance(
  employeeId: string,
): Promise<AttendanceWithEvents> {
  const date = startOfUtcDay();

  const existing = await attendanceRepository.findByEmployeeAndDate(employeeId, date);

  if (existing) {
    return existing;
  }

  return attendanceRepository.create({
    employeeId,
    date,
    status: AttendanceStatus.PRESENT,
    completionStatus: null,
  });
}
