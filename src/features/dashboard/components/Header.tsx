'use client';

import { Menu, X } from 'lucide-react';

import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import type { AuthUser } from '@/features/auth/types';

import { UserMenu } from './UserMenu';

type HeaderProps = {
  user: AuthUser;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLogout?: () => void;
};

export function Header({ user, isSidebarOpen, onToggleSidebar, onLogout }: HeaderProps) {
  return (
    <header className="border-border bg-sidebar sticky top-0 z-10 border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile menu button + title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>

          <div className="hidden sm:block">
            <h2 className="text-foreground text-xl font-semibold tracking-tight">Dashboard</h2>
          </div>
        </div>

        {/* Right: Theme toggle + User menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
