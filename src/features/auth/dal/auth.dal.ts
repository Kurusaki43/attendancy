import { redirect } from 'next/dist/client/components/navigation';
import { cache } from 'react';

import { requireAuth } from '../lib/require-auth';
import { userRepository } from '../repositories/user.repository';

export const getCurrentUser = cache(async () => {
  const payload = await requireAuth();

  const user = await userRepository.findById(payload.userId);

  if (!user) {
    redirect('/api/auth/invalid-session');
  }

  return user;
});
