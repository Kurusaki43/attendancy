import { ERROR_CODES } from '@/lib/errors/error-codes';
import { ForbiddenError } from '@/lib/errors/forbidden.error';
import type { RoleName } from '@/server/auth/constants/roles';
import { getCurrentUser } from '@/server/auth/lib/get-current-user';
import type { AuthUser } from '@/server/auth/types/auth-user';

export function hasRole(user: AuthUser, role: RoleName) {
  return user.roles.some((r) => r.name === role);
}

export async function requireRole(role: RoleName) {
  const user = await getCurrentUser();

  if (!hasRole(user, role)) {
    throw new ForbiddenError(ERROR_CODES.FORBIDDEN, `Missing role: ${role}`);
  }

  return user;
}
