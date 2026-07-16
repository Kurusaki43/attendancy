// src/features/auth/lib/get-current-user.ts

import { redirect } from 'next/navigation';
import { cache } from 'react';

import { UserStatus } from '@/generated/prisma/client';
import { requireAuth } from '@/server/auth/guards/require-auth';
import { userRepository } from '@/server/auth/repositories/user.repository';

export const getCurrentUser = cache(async () => {
  const payload = await requireAuth();

  const user = await userRepository.findById(payload.userId);

  if (!user) {
    redirect('/api/auth/invalid-session');
  }

  // requireAuth's session-table check catches an explicitly revoked session, but not an account
  // suspended/deactivated after the session was issued — re-check status on every request so a
  // suspended user's still-valid session can't keep working until its natural expiry.
  if (user.status !== UserStatus.ACTIVE) {
    redirect('/api/auth/invalid-session');
  }

  return user;
});
