export const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'ON_LEAVE', 'HOLIDAY'] as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  ON_LEAVE: 'On Leave',
  HOLIDAY: 'Holiday',
};

export const ATTENDANCE_STATUS_BADGE_CLASSES: Record<AttendanceStatus, string> = {
  PRESENT: 'bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  ABSENT: 'bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  ON_LEAVE: 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  HOLIDAY: 'bg-blue-500/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
};

export const ATTENDANCE_STATUS_DOT_CLASSES: Record<AttendanceStatus, string> = {
  PRESENT: 'bg-green-500',
  ABSENT: 'bg-red-500',
  ON_LEAVE: 'bg-amber-500',
  HOLIDAY: 'bg-blue-500',
};

export const ATTENDANCE_STATUS_PANEL_CLASSES: Record<AttendanceStatus, string> = {
  PRESENT: 'border-green-500/20 bg-green-500/10',
  ABSENT: 'border-red-500/20 bg-red-500/10',
  ON_LEAVE: 'border-amber-500/20 bg-amber-500/10',
  HOLIDAY: 'border-blue-500/20 bg-blue-500/10',
};

export const ATTENDANCE_COMPLETION_STATUSES = ['COMPLETE', 'INCOMPLETE'] as const;

export type AttendanceCompletionStatus = (typeof ATTENDANCE_COMPLETION_STATUSES)[number];

export const ATTENDANCE_COMPLETION_STATUS_LABELS: Record<AttendanceCompletionStatus, string> = {
  COMPLETE: 'Complete',
  INCOMPLETE: 'Incomplete',
};

export const ATTENDANCE_COMPLETION_STATUS_BADGE_CLASSES: Record<
  AttendanceCompletionStatus,
  string
> = {
  COMPLETE: 'bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  INCOMPLETE: 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
};

export const ATTENDANCE_COMPLETION_STATUS_DOT_CLASSES: Record<AttendanceCompletionStatus, string> =
  {
    COMPLETE: 'bg-green-500',
    INCOMPLETE: 'bg-amber-500',
  };

export const ATTENDANCE_COMPLETION_STATUS_PANEL_CLASSES: Record<
  AttendanceCompletionStatus,
  string
> = {
  COMPLETE: 'border-green-500/20 bg-green-500/10',
  INCOMPLETE: 'border-amber-500/20 bg-amber-500/10',
};

export const ATTENDANCE_METHODS = ['QR', 'FACE', 'FINGERPRINT', 'MANUAL'] as const;

export type AttendanceMethod = (typeof ATTENDANCE_METHODS)[number];

export const ATTENDANCE_METHOD_LABELS: Record<AttendanceMethod, string> = {
  QR: 'QR Scan',
  FACE: 'Face Scan',
  FINGERPRINT: 'Fingerprint',
  MANUAL: 'Manual',
};

export const ATTENDANCE_METHOD_BADGE_CLASSES: Record<AttendanceMethod, string> = {
  QR: 'bg-blue-500/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  FACE: 'bg-purple-500/15 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
  FINGERPRINT: 'bg-cyan-500/15 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400',
  MANUAL: 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
};
