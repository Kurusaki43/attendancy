import type { AttendanceWithEmployee, AttendanceWithEvents } from '@/server/attendance/types';
import type { AttendanceResult } from '@/server/attendance/types/action-results';

export function toAttendanceResult(
  attendance: AttendanceWithEmployee | AttendanceWithEvents,
): AttendanceResult {
  return {
    id: attendance.id,
    date: attendance.date,
    firstClockIn: attendance.firstClockIn,
    lastClockOut: attendance.lastClockOut,
    workedMinutes: attendance.workedMinutes,
    status: attendance.status,
    completionStatus: attendance.completionStatus,
    hasManualChanges: attendance.hasManualChanges,
    employee: {
      id: attendance.employee.id,
      employeeCode: attendance.employee.employeeCode,
      user: attendance.employee.user,
      department: attendance.employee.department,
      position: attendance.employee.position,
    },
    ...('events' in attendance && {
      events: attendance.events.map((event) => ({
        id: event.id,
        type: event.type,
        occurredAt: event.occurredAt,
        method: event.method,
        reason: event.reason,
      })),
    }),
  };
}
