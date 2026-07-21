import {
  AttendanceMethod,
  AttendanceStatus,
  EmploymentStatus,
  UserStatus,
} from '@/generated/prisma/enums';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { InternalServerError } from '@/lib/errors/internal-server.error';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { prisma } from '@/lib/prisma';
import { computeAttendanceSummary } from '@/server/attendance/lib/compute-attendance-summary';
import { validateAttendanceEvents } from '@/server/attendance/lib/validate-attendance-events';
import { attendanceRepository } from '@/server/attendance/repositories/attendance.repository';
import type { UpdateAttendanceInput } from '@/server/attendance/schemas/update-attendance.schema';
import type { AttendanceWithEvents } from '@/server/attendance/types';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';

const NOT_EDITABLE_STATUSES = new Set<AttendanceStatus>([
  AttendanceStatus.ON_LEAVE,
  AttendanceStatus.HOLIDAY,
]);

export async function updateAttendance(
  attendanceId: string,
  input: UpdateAttendanceInput,
): Promise<AttendanceWithEvents> {
  const attendance = await attendanceRepository.findById(attendanceId);

  if (!attendance) {
    throw new NotFoundError(ERROR_CODES.ATTENDANCE_NOT_FOUND, 'Attendance record not found!');
  }

  if (NOT_EDITABLE_STATUSES.has(attendance.status)) {
    throw new BadRequestError(
      ERROR_CODES.ATTENDANCE_NOT_EDITABLE,
      'On-leave and holiday attendance records are managed automatically and cannot be edited here.',
    );
  }

  const employee = await employeeRepository.findById(attendance.employeeId);

  if (!employee) {
    throw new NotFoundError(ERROR_CODES.EMPLOYEE_NOT_FOUND, 'Employee not found!');
  }

  if (employee.employmentStatus === EmploymentStatus.TERMINATED) {
    throw new BadRequestError(
      ERROR_CODES.EMPLOYEE_NOT_ACTIVE,
      'Attendance can only be updated for active or on-leave employees.',
    );
  }

  if (employee.user.status !== UserStatus.ACTIVE) {
    throw new BadRequestError(
      ERROR_CODES.EMPLOYEE_USER_INACTIVE,
      "This employee's user account is not active.",
    );
  }

  if (input.events.length === 0) {
    await prisma.$transaction([
      prisma.attendanceEvent.deleteMany({ where: { attendanceId } }),
      prisma.attendance.update({
        where: { id: attendanceId },
        data: {
          status: AttendanceStatus.ABSENT,
          firstClockIn: null,
          lastClockOut: null,
          workedMinutes: 0,
          hasManualChanges: true,
        },
      }),
    ]);

    const updated = await attendanceRepository.findById(attendanceId);

    if (!updated) {
      throw new InternalServerError(
        ERROR_CODES.ATTENDANCE_NOT_FOUND,
        'Attendance was updated but could not be reloaded.',
      );
    }

    return updated;
  }

  validateAttendanceEvents(input.events, attendance.date);

  const submittedIds = new Set(input.events.flatMap((event) => (event.id ? [event.id] : [])));
  const toDelete = attendance.events.filter((event) => !submittedIds.has(event.id));
  const toUpdate = input.events.filter((event) => event.id);
  const toCreate = input.events.filter((event) => !event.id);

  const summary = computeAttendanceSummary(input.events);

  await prisma.$transaction([
    ...toDelete.map((event) => prisma.attendanceEvent.delete({ where: { id: event.id } })),
    ...toUpdate.map((event) =>
      prisma.attendanceEvent.update({
        where: { id: event.id },
        data: {
          type: event.type,
          occurredAt: event.occurredAt,
          reason: event.reason,
          method: AttendanceMethod.MANUAL,
        },
      }),
    ),
    ...(toCreate.length > 0
      ? [
          prisma.attendanceEvent.createMany({
            data: toCreate.map((event) => ({
              attendanceId,
              type: event.type,
              occurredAt: event.occurredAt,
              method: AttendanceMethod.MANUAL,
              reason: event.reason,
            })),
          }),
        ]
      : []),
    prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        status: AttendanceStatus.PRESENT,
        firstClockIn: summary.firstClockIn,
        lastClockOut: summary.lastClockOut,
        workedMinutes: summary.workedMinutes,
        hasManualChanges: true,
      },
    }),
  ]);

  const updated = await attendanceRepository.findById(attendanceId);

  if (!updated) {
    throw new InternalServerError(
      ERROR_CODES.ATTENDANCE_NOT_FOUND,
      'Attendance was updated but could not be reloaded.',
    );
  }

  return updated;
}
