import { describe, expect, it } from 'vitest';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import type { AuthUser } from '@/server/auth/types/auth-user';

import { hasPermission } from '../../guards/require-permission';

function buildUser(permissions: { resource: string; action: string }[]): AuthUser {
  return {
    roles: [
      {
        permissions: permissions.map((p, index) => ({
          id: `perm-${index}`,
          resource: p.resource,
          action: p.action,
          description: null,
        })),
      },
    ],
  } as unknown as AuthUser;
}

describe('hasPermission', () => {
  it('returns true when a role grants the exact resource/action pair', () => {
    const user = buildUser([{ resource: 'department', action: 'create' }]);

    expect(hasPermission(user, PERMISSIONS.DEPARTMENT_CREATE)).toBe(true);
  });

  it('returns false when no role grants the permission', () => {
    const user = buildUser([{ resource: 'department', action: 'read' }]);

    expect(hasPermission(user, PERMISSIONS.DEPARTMENT_CREATE)).toBe(false);
  });

  it('returns false when the resource matches but the action does not', () => {
    const user = buildUser([{ resource: 'department', action: 'update' }]);

    expect(hasPermission(user, PERMISSIONS.DEPARTMENT_DELETE)).toBe(false);
  });

  it('returns false for a user with no roles', () => {
    const user = { roles: [] } as unknown as AuthUser;

    expect(hasPermission(user, PERMISSIONS.DEPARTMENT_READ)).toBe(false);
  });
});
