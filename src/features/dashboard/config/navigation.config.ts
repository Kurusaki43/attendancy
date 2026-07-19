import {
  BadgeCheck,
  BarChart3,
  Briefcase,
  Building2,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  Clock,
  LayoutDashboard,
  QrCode,
  Settings,
  Users,
} from 'lucide-react';

import type { NavGroup } from '@/features/dashboard/types/navigation.types';
import { PERMISSIONS } from '@/server/auth/constants/permissions';

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: 'Management',
    items: [
      {
        title: 'Departments',
        href: '/dashboard/departments',
        icon: Building2,
        roles: ['ADMIN', 'MANAGER'],
        permission: PERMISSIONS.DEPARTMENT_READ,
      },
      {
        title: 'Positions',
        href: '/dashboard/positions',
        icon: Briefcase,
        roles: ['ADMIN', 'MANAGER'],
        permission: PERMISSIONS.POSITION_READ,
      },
      {
        title: 'Employees',
        href: '/dashboard/employees',
        icon: Users,
        roles: ['ADMIN', 'MANAGER'],
        permission: PERMISSIONS.EMPLOYEE_READ,
      },
      {
        title: 'All Attendance',
        href: '/dashboard/attendance/all',
        icon: CalendarDays,
        roles: ['ADMIN', 'MANAGER'],
        permission: PERMISSIONS.ATTENDANCE_READ_ALL,
      },
      {
        title: 'Leave Requests',
        href: '/dashboard/leave/manage',
        icon: ClipboardList,
        roles: ['ADMIN', 'MANAGER'],
        permission: PERMISSIONS.LEAVE_READ_ALL,
      },
      {
        title: 'Attendance QR',
        href: '/attendance-qr',
        icon: QrCode,
        roles: ['ADMIN'],
        permission: PERMISSIONS.ATTENDANCE_QR_VIEW,
      },
    ],
  },
  {
    label: 'My Work',
    items: [
      {
        title: 'Clock In / Out',
        href: '/dashboard/attendance/clock',
        icon: Clock,
        permission: PERMISSIONS.ATTENDANCE_CLOCK_IN,
      },
      {
        title: 'My Attendance',
        href: '/dashboard/attendance/me',
        icon: CalendarClock,
        permission: PERMISSIONS.ATTENDANCE_READ_SELF,
      },
      {
        title: 'My Leave',
        href: '/dashboard/leave/me',
        icon: CalendarDays,
        permission: PERMISSIONS.LEAVE_READ_SELF,
      },
    ],
  },
  {
    label: 'Reports',
    items: [
      {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
        roles: ['ADMIN', 'MANAGER'],
      },
      {
        title: 'Audit Log',
        href: '/dashboard/audit',
        icon: BadgeCheck,
        roles: ['ADMIN'],
      },
    ],
  },
  {
    label: 'Settings',
    items: [
      {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
      },
    ],
  },
];
