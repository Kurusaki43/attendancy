import type { AuthUser } from '@/server/auth/types';

import type { NavItem } from '../types/navigation.types';

export function canSeeNavItem(item: NavItem, user: AuthUser): boolean {
  const userRoleNames = user.roles.map((r) => r.name);

  // Check role-based access
  if (item.roles && item.roles.length > 0) {
    const hasRole = item.roles.some((r) => userRoleNames.includes(r));
    if (!hasRole) return false;
  }

  // Check permission-based access
  if (item.permission) {
    const [resource, action] = item.permission.split(':');
    const hasPermission = user.roles.some((role) =>
      role.permissions.some((p) => p.resource === resource && p.action === action),
    );
    if (!hasPermission) return false;
  }

  return true;
}
