'use client';

import { format } from 'date-fns';
import { Bell, Menu } from 'lucide-react';

import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import type { AuthUser } from '@/server/auth/types';

import { UserMenu } from './UserMenu';

type HeaderProps = {
  user: AuthUser;
  onToggleSidebar: () => void;
  onLogout?: () => void;
};

export function Header({ user, onToggleSidebar, onLogout }: HeaderProps) {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-30 border-b backdrop-blur-xl">
      <div className="flex h-[72px] items-center justify-between px-3 sm:px-4 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 w-fit lg:hidden"
            onClick={onToggleSidebar}
          >
            <Menu className="size-6" />
          </Button>

          <div className="hidden flex-col sm:flex">
            <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>

            <p className="text-muted-foreground text-sm">{format(new Date(), 'EEEE, MMMM d')}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Button variant="outline" className="hidden w-64 justify-between lg:flex">
            <span className="text-muted-foreground">Search...</span>

            <kbd className="text-xs">⌘K</kbd>
          </Button>

          {/* Notifications */}

          <Button variant="ghost" size="icon">
            <Bell className="size-5" />
          </Button>

          <ThemeToggle />

          <UserMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
