import { ERROR_CODES } from '@/lib/errors/error-codes';
import { ForbiddenError } from '@/lib/errors/forbidden.error';
import { type PermissionDefinition } from '@/server/auth/constants/permissions';
import { getCurrentUser } from '@/server/auth/lib/get-current-user';
import type { AuthUser } from '@/server/auth/types/auth-user';

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
    throw new ForbiddenError(
      ERROR_CODES.FORBIDDEN,
      `Missing permission: ${permission.resource}:${permission.action}`,
    );
  }

  return user;
}
