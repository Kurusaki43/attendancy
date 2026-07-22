export const EMPLOYMENT_STATUSES = ['ACTIVE', 'TERMINATED'] as const;

export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number];

export const EMPLOYMENT_STATUS_LABELS: Record<EmploymentStatus, string> = {
  ACTIVE: 'Active',
  TERMINATED: 'Terminated',
};

export const EMPLOYMENT_STATUS_BADGE_CLASSES: Record<EmploymentStatus, string> = {
  ACTIVE: 'bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  TERMINATED: 'bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

export const EMPLOYMENT_STATUS_DOT_CLASSES: Record<EmploymentStatus, string> = {
  ACTIVE: 'bg-green-500',
  TERMINATED: 'bg-red-500',
};
