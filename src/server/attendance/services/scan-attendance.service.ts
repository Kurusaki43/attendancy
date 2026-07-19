import { AttendanceEventType, AttendanceMethod } from '@/generated/prisma/enums';
import { attendanceEventRepository } from '@/server/attendance/repositories/attendance-event.repository';
import { clockIn } from '@/server/attendance/services/clock-in.service';
import { clockOut } from '@/server/attendance/services/clock-out.service';
import { findOrCreateTodayAttendance } from '@/server/attendance/services/find-or-create-today-attendance.service';
import { verifyAttendanceQrCode } from '@/server/attendance/services/verify-attendance-qr.service';
import type { ServiceScanAttendanceResult } from '@/server/attendance/types/service-results';

export async function scanAttendance(
  employeeId: string,
  token: string,
): Promise<ServiceScanAttendanceResult> {
  await verifyAttendanceQrCode(token);

  const attendance = await findOrCreateTodayAttendance(employeeId);

  const lastEvent = await attendanceEventRepository.findLastByAttendanceId(attendance.id);

  if (!lastEvent) {
    return {
      eventType: AttendanceEventType.CLOCK_IN,
      attendance: await clockIn(attendance, AttendanceMethod.QR),
    };
  }

  if (lastEvent.type === AttendanceEventType.CLOCK_IN) {
    return {
      eventType: AttendanceEventType.CLOCK_OUT,
      attendance: await clockOut(attendance, lastEvent, AttendanceMethod.QR),
    };
  }

  return {
    eventType: AttendanceEventType.CLOCK_IN,
    attendance: await clockIn(attendance, AttendanceMethod.QR),
  };
}
