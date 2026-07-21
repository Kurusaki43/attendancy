export const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'ON_LEAVE', 'HOLIDAY'] as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export type AttendanceDisplayStatus = AttendanceStatus | 'INCOMPLETE';

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceDisplayStatus, string> = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  ON_LEAVE: 'On Leave',
  HOLIDAY: 'Holiday',
  INCOMPLETE: 'Incomplete',
};

export const ATTENDANCE_STATUS_BADGE_CLASSES: Record<AttendanceDisplayStatus, string> = {
  PRESENT: 'bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  ABSENT: 'bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  ON_LEAVE: 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  HOLIDAY: 'bg-blue-500/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  INCOMPLETE: 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
};

export const ATTENDANCE_STATUS_DOT_CLASSES: Record<AttendanceDisplayStatus, string> = {
  PRESENT: 'bg-green-500',
  ABSENT: 'bg-red-500',
  ON_LEAVE: 'bg-amber-500',
  HOLIDAY: 'bg-blue-500',
  INCOMPLETE: 'bg-amber-500',
};

export const ATTENDANCE_STATUS_PANEL_CLASSES: Record<AttendanceDisplayStatus, string> = {
  PRESENT: 'border-green-500/20 bg-green-500/10',
  ABSENT: 'border-red-500/20 bg-red-500/10',
  ON_LEAVE: 'border-amber-500/20 bg-amber-500/10',
  HOLIDAY: 'border-blue-500/20 bg-blue-500/10',
  INCOMPLETE: 'border-amber-500/20 bg-amber-500/10',
};

export function getAttendanceDisplayStatus(
  status: AttendanceStatus,
  firstClockIn: Date | null,
  lastClockOut: Date | null,
): AttendanceDisplayStatus {
  if (status === 'PRESENT' && firstClockIn && !lastClockOut) {
    return 'INCOMPLETE';
  }

  return status;
}

export function formatWorkedMinutes(workedMinutes: number) {
  const hours = Math.floor(workedMinutes / 60);
  const minutes = workedMinutes % 60;

  if (hours === 0) return `${minutes}m`;

  return `${hours}h ${minutes}m`;
}
