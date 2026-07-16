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
  Settings,
  Users,
} from 'lucide-react';

import type { NavGroup } from '@/features/dashboard/types/navigation.types';

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        // Visible to everyone
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
        permission: 'department:read',
      },
      {
        title: 'Positions',
        href: '/dashboard/positions',
        icon: Briefcase,
        roles: ['ADMIN', 'MANAGER'],
        permission: 'position:read',
      },
      {
        title: 'Employees',
        href: '/dashboard/employees',
        icon: Users,
        roles: ['ADMIN', 'MANAGER'],
        permission: 'employee:read',
      },
      {
        title: 'All Attendance',
        href: '/dashboard/attendance/all',
        icon: CalendarDays,
        roles: ['ADMIN', 'MANAGER'],
        permission: 'attendance:read:all',
      },
      {
        title: 'Leave Requests',
        href: '/dashboard/leave/manage',
        icon: ClipboardList,
        roles: ['ADMIN', 'MANAGER'],
        permission: 'leave:read:all',
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
        permission: 'attendance:clock-in',
      },
      {
        title: 'My Attendance',
        href: '/dashboard/attendance/me',
        icon: CalendarClock,
        permission: 'attendance:read:self',
      },
      {
        title: 'My Leave',
        href: '/dashboard/leave/me',
        icon: CalendarDays,
        permission: 'leave:read:self',
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
        // Visible to everyone
      },
    ],
  },
];
