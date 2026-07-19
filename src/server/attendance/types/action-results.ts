import type { AttendanceEventType, AttendanceStatus } from '@/generated/prisma/enums';

export type GetAttendanceQrActionResult = {
  qrDataUrl: string;
  issuedAt: number;
  expiresInMs: number;
};

export type ScanAttendanceActionResult = {
  eventType: AttendanceEventType;
  status: AttendanceStatus;
  firstClockIn: Date | null;
  lastClockOut: Date | null;
  workedMinutes: number;
};
