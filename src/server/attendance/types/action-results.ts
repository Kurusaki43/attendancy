import type { AttendanceEventType, AttendanceStatus } from '@/generated/prisma/enums';

export type GetAttendanceQrActionResult = {
  qrDataUrl: string;
  issuedAt: number;
  expiresInMs: number;
};

export type ScanAttendanceActionResult = {
  eventType: AttendanceEventType;
  occurredAt: Date;
  status: AttendanceStatus;
  workedMinutes: number;
};
