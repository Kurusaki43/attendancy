import { describe, expect, it } from 'vitest';

import { hasRole } from '@/server/auth/guards/require-role';
import type { AuthUser } from '@/server/auth/types/auth-user';

function buildUser(roleNames: string[]): AuthUser {
  return {
    roles: roleNames.map((name, index) => ({
      id: `role-${index}`,
      name,
      permissions: [],
    })),
  } as unknown as AuthUser;
}

describe('hasRole', () => {
  it('returns true when the user has the given role', () => {
    const user = buildUser(['ADMIN']);

    expect(hasRole(user, 'ADMIN')).toBe(true);
  });

  it('returns false when the user does not have the given role', () => {
    const user = buildUser(['EMPLOYEE']);

    expect(hasRole(user, 'ADMIN')).toBe(false);
  });

  it('returns true when the role is one of several assigned roles', () => {
    const user = buildUser(['EMPLOYEE', 'MANAGER']);

    expect(hasRole(user, 'MANAGER')).toBe(true);
  });

  it('returns false for a user with no roles', () => {
    const user = buildUser([]);

    expect(hasRole(user, 'ADMIN')).toBe(false);
  });
});
