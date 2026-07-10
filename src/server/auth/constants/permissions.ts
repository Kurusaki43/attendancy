// src/features/auth/constants/permissions.ts

function permission(resource: string, action: string, description: string) {
  return {
    resource,
    action,
    description,
  } as const;
}

export const PERMISSIONS = {
  // Departments
  DEPARTMENT_READ: permission('department', 'read', 'View departments'),

  DEPARTMENT_CREATE: permission('department', 'create', 'Create departments'),

  DEPARTMENT_UPDATE: permission('department', 'update', 'Update departments'),

  DEPARTMENT_DELETE: permission('department', 'delete', 'Delete departments'),

  // Employees
  EMPLOYEE_READ: permission('employee', 'read', 'View employees'),

  EMPLOYEE_CREATE: permission('employee', 'create', 'Create employees'),

  EMPLOYEE_UPDATE: permission('employee', 'update', 'Update employee information'),

  EMPLOYEE_DELETE: permission('employee', 'delete', 'Delete employees'),

  // Attendance
  ATTENDANCE_READ_ALL: permission('attendance', 'read:all', 'View all attendance records'),

  ATTENDANCE_READ_SELF: permission('attendance', 'read:self', 'View personal attendance records'),

  ATTENDANCE_CLOCK_IN: permission('attendance', 'clock-in', 'Clock in to work'),

  ATTENDANCE_CLOCK_OUT: permission('attendance', 'clock-out', 'Clock out from work'),

  ATTENDANCE_EDIT: permission('attendance', 'edit', 'Edit attendance records'),

  // Leave requests
  LEAVE_CREATE: permission('leave', 'create', 'Create leave requests'),

  LEAVE_READ_SELF: permission('leave', 'read:self', 'View personal leave requests'),

  LEAVE_READ_ALL: permission('leave', 'read:all', 'View all leave requests'),

  LEAVE_APPROVE: permission('leave', 'approve', 'Approve leave requests'),

  LEAVE_REJECT: permission('leave', 'reject', 'Reject leave requests'),

  // Profile
  PROFILE_READ_SELF: permission('profile', 'read:self', 'View personal profile'),

  PROFILE_UPDATE_SELF: permission('profile', 'update:self', 'Update personal profile'),

  // Sessions
  SESSION_READ_SELF: permission('session', 'read:self', 'View personal login sessions'),

  SESSION_REVOKE_SELF: permission('session', 'revoke:self', 'Revoke personal login sessions'),
} as const;

export type PermissionDefinition = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
