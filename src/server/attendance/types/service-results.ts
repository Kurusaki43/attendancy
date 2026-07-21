import type { AttendanceEventType } from '@/generated/prisma/enums';
import type {
  AttendanceWithEmployee,
  AttendanceWithEvents,
} from '@/server/attendance/repositories/attendance.repository';

export type { AttendanceWithEmployee, AttendanceWithEvents };

export type ServiceRotateAttendanceQrResult = {
  token: string;
  qrDataUrl: string;
  issuedAt: number;
  expiresInMs: number;
};

export type ServiceVerifyAttendanceQrResult = {
  valid: true;
};

export type ServiceScanAttendanceResult = {
  eventType: AttendanceEventType;
  attendance: AttendanceWithEvents;
};
