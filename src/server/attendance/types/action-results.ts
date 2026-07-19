import type { AttendanceEventType, AttendanceStatus } from '@/generated/prisma/enums';
import type { PaginationMeta } from '@/shared/types/api-feature';

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

export type AttendanceEmployeeResult = {
  id: string;
  employeeCode: string;
  user: {
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  department: {
    id: string;
    name: string;
    code: string;
    icon: string | null;
    color: string | null;
  } | null;
  position: {
    id: string;
    title: string;
  } | null;
};

export type AttendanceResult = {
  id: string;
  date: Date;
  firstClockIn: Date | null;
  lastClockOut: Date | null;
  workedMinutes: number;
  status: AttendanceStatus;
  employee: AttendanceEmployeeResult;
};

export type GetAllAttendanceActionResult = {
  attendance: AttendanceResult[];
  pagination: PaginationMeta;
};
