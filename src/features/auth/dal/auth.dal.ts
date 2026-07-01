// src/features/auth/dal/auth.dal.ts

import { cache } from 'react';

import { requireAuth } from '../lib/require-auth';
import { userRepository } from '../repositories/user.repository';

export const getCurrentUser = cache(async () => {
  const payload = await requireAuth();

  const user = await userRepository.findById(payload.userId);

  if (!user) {
    throw new Error('Authenticated user not found');
  }

  return user;
});
