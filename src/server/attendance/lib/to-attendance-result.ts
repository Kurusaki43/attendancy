import type { AttendanceWithEmployee } from '@/server/attendance/types';
import type { AttendanceResult } from '@/server/attendance/types/action-results';

export function toAttendanceResult(attendance: AttendanceWithEmployee): AttendanceResult {
  return {
    id: attendance.id,
    date: attendance.date,
    firstClockIn: attendance.firstClockIn,
    lastClockOut: attendance.lastClockOut,
    workedMinutes: attendance.workedMinutes,
    status: attendance.status,
    employee: {
      id: attendance.employee.id,
      employeeCode: attendance.employee.employeeCode,
      user: attendance.employee.user,
      department: attendance.employee.department,
      position: attendance.employee.position,
    },
  };
}
