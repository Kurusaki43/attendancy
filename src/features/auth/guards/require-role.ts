import { ERROR_CODES } from '@/lib/errors/error-codes';
import { ForbiddenError } from '@/lib/errors/forbidden.error';

import type { RoleName } from '../constants/roles';
import { getCurrentUser } from '../lib/get-current-user';
import type { AuthUser } from '../types/auth-user';

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
