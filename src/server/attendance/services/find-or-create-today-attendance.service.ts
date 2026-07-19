import { startOfDay } from 'date-fns';

import { AttendanceStatus } from '@/generated/prisma/enums';
import {
  attendanceRepository,
  type AttendanceWithEvents,
} from '@/server/attendance/repositories/attendance.repository';

export async function findOrCreateTodayAttendance(
  employeeId: string,
): Promise<AttendanceWithEvents> {
  const date = startOfDay(new Date());

  const existing = await attendanceRepository.findByEmployeeAndDate(employeeId, date);

  if (existing) {
    return existing;
  }

  return attendanceRepository.create({ employeeId, date, status: AttendanceStatus.PRESENT });
}
