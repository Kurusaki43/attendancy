'use client';

import { LogOut } from 'lucide-react';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
import { logoutAction } from '@/server/auth/actions/logout.action';

type LogoutButtonProps = {
  onLogout?: () => void;
  className?: string;
};

export function LogoutButton({ onLogout, className }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      onLogout?.();
    });
  };

  return (
    <button
      disabled={isPending}
      onClick={handleLogout}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        'bg-primary text-primary-foreground shadow-sm',
        'hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
    >
      <LogOut className="size-4" />
      <span>{isPending ? 'Logging out...' : 'Logout'}</span>
    </button>
  );
}
