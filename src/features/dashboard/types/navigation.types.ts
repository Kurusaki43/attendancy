import type { LucideIcon } from 'lucide-react';

import type { PermissionDefinition } from '@/server/auth/constants/permissions';
import type { RoleName } from '@/server/auth/constants/roles';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: RoleName[];
  permission?: PermissionDefinition;
  badge?: string | number;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};
