import type { LucideIcon } from 'lucide-react';

import type { RoleName } from '@/server/auth/constants/roles';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Roles that can see this item. If undefined, all authenticated users can see it. */
  roles?: RoleName[];
  /** Permission required: "resource:action" */
  permission?: string;
  badge?: string | number;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};
