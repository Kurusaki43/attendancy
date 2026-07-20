import { attendanceRepository } from '@/server/attendance/repositories/attendance.repository';
import type { FindAttendanceByEmployeeDateInput } from '@/server/attendance/schemas/find-attendance-by-employee-date.schema';
import { parseUtcDate } from '@/shared/utils/date';

export async function findAttendanceByEmployeeDate(
  input: FindAttendanceByEmployeeDateInput,
): Promise<{ id: string } | null> {
  const date = parseUtcDate(input.date);
  const attendance = await attendanceRepository.findByEmployeeAndDate(input.employeeId, date);

  return attendance ? { id: attendance.id } : null;
}
