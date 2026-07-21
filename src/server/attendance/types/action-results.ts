import type {
  AttendanceCompletionStatus,
  AttendanceEventType,
  AttendanceStatus,
} from '@/generated/prisma/enums';
import type { PaginationMeta } from '@/shared/types/api-feature';

export type GetAttendanceQrActionResult = {
  qrDataUrl: string;
  issuedAt: number;
  expiresInMs: number;
  locale: string;
  timezone: string;
};

export type ScanAttendanceActionResult = {
  eventType: AttendanceEventType;
  occurredAt: Date;
  status: AttendanceStatus;
  workedMinutes: number;
  locale: string;
  timezone: string;
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

export type AttendanceEventResult = {
  id: string;
  type: AttendanceEventType;
  occurredAt: Date;
  reason: string | null;
};

export type AttendanceResult = {
  id: string;
  date: Date;
  firstClockIn: Date | null;
  lastClockOut: Date | null;
  workedMinutes: number;
  status: AttendanceStatus;
  completionStatus: AttendanceCompletionStatus | null;
  employee: AttendanceEmployeeResult;
  events?: AttendanceEventResult[];
};

export type GetAllAttendanceActionResult = {
  attendance: AttendanceResult[];
  pagination: PaginationMeta;
};

export type CreateAttendanceActionResult = AttendanceResult;
export type UpdateAttendanceActionResult = AttendanceResult;
export type GetAttendanceActionResult = AttendanceResult;
