import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { attendanceRepository } from '@/server/attendance/repositories/attendance.repository';
import type { AttendanceWithEvents } from '@/server/attendance/types';

export async function getAttendance(attendanceId: string): Promise<AttendanceWithEvents> {
  const attendance = await attendanceRepository.findById(attendanceId);

  if (!attendance) {
    throw new NotFoundError(ERROR_CODES.ATTENDANCE_NOT_FOUND, 'Attendance record not found!');
  }

  return attendance;
}
