export const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'INVITED', 'SUSPENDED'] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  INVITED: 'Invited',
  SUSPENDED: 'Suspended',
};

export const USER_STATUS_BADGE_CLASSES: Record<UserStatus, string> = {
  ACTIVE: 'bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  INACTIVE: 'bg-muted text-muted-foreground',
  INVITED: 'bg-blue-500/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  SUSPENDED: 'bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

export const USER_STATUS_DOT_CLASSES: Record<UserStatus, string> = {
  ACTIVE: 'bg-green-500',
  INACTIVE: 'bg-muted-foreground',
  INVITED: 'bg-blue-500',
  SUSPENDED: 'bg-red-500',
};
