import { type PermissionDefinition } from '../constants/permissions';
import { getCurrentUser } from '../dal/auth.dal';
import type { AuthUser } from '../types/auth-user';

export function hasPermission(user: AuthUser, permission: PermissionDefinition) {
  return user.roles.some((role) =>
    role.permissions.some(
      (p) => p.resource === permission.resource && p.action === permission.action,
    ),
  );
}

export async function requirePermission(permission: PermissionDefinition) {
  const user = await getCurrentUser();

  if (!hasPermission(user, permission)) {
    throw new Error(`Missing permission: ${permission.resource}:${permission.action}`);
  }

  return user;
}
