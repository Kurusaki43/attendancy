// src/features/auth/lib/get-current-user.ts

import { redirect } from 'next/navigation';
import { cache } from 'react';

import { requireAuth } from '@/server/auth/guards/require-auth';
import { userRepository } from '@/server/auth/repositories/user.repository';

export const getCurrentUser = cache(async (returnTo: string = '/dashboard') => {
  const payload = await requireAuth(returnTo);

  const user = await userRepository.findById(payload.userId);

  if (!user) {
    redirect('/api/auth/invalid-session');
  }

  return user;
});
