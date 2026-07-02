// src/features/auth/constants/roles.ts

export const ROLES = {
  ADMIN: {
    name: 'ADMIN',
    description: 'Manages employees, attendance records, and leave requests.',
  },

  MANAGER: {
    name: 'MANAGER',
    description: 'Supervises team members and approves attendance and leave requests.',
  },

  EMPLOYEE: {
    name: 'EMPLOYEE',
    description: 'Views personal attendance, clocks in/out, and requests leave.',
  },
} as const;

export const ROLE_NAMES = {
  ADMIN: ROLES.ADMIN.name,
  MANAGER: ROLES.MANAGER.name,
  EMPLOYEE: ROLES.EMPLOYEE.name,
} as const;

export type Role = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES];
