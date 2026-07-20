import type { AuthUser } from '@/server/auth/types/auth-user';
import type { ServiceGetProfileResult } from '@/server/profile/types';

export function getProfile(user: AuthUser): ServiceGetProfileResult {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar,
    provider: user.provider,
    emailVerifiedAt: user.emailVerifiedAt,
    hasPassword: user.passwordHash !== null,
    roles: user.roles.map((role) => role.name),
    createdAt: user.createdAt,
    locale: user.locale,
    timezone: user.timezone,
  };
}
