import type { RoleName } from '../constants/roles';
import { getCurrentUser } from '../dal/auth.dal';
import type { AuthUser } from '../types/auth-user';

export function hasRole(user: AuthUser, role: RoleName) {
  return user.roles.some((r) => r.name === role);
}

export async function requireRole(role: RoleName) {
  const user = await getCurrentUser();

  if (!hasRole(user, role)) {
    throw new Error(`Missing role: ${role}`);
  }

  return user;
}
