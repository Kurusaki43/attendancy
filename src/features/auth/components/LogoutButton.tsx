'use client';

import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { logoutAction } from '@/features/auth/actions/logout.action';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await logoutAction();
        });
      }}
    >
      {isPending ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
