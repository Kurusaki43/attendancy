'use client';

import { format } from 'date-fns';
import { Bell, Menu, X } from 'lucide-react';

import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import type { AuthUser } from '@/server/auth/types';

import { UserMenu } from './UserMenu';

type HeaderProps = {
  user: AuthUser;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLogout?: () => void;
};

export function Header({ user, isSidebarOpen, onToggleSidebar, onLogout }: HeaderProps) {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-30 backdrop-blur-xl">
      <div className="flex h-[72px] items-center justify-between px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleSidebar}>
            {isSidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>

          <div className="flex flex-col">
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
