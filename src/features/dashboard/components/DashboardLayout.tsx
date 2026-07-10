'use client';

import { type ReactNode, useState } from 'react';

import { NAV_GROUPS } from '@/features/dashboard/config/navigation.config';
import type { AuthUser } from '@/server/auth/types';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

type DashboardLayoutProps = {
  children: ReactNode;
  user: AuthUser;
};

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-background flex h-screen w-full overflow-hidden">
      <Sidebar
        user={user}
        navGroups={NAV_GROUPS}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex h-full w-full flex-col overflow-auto">
        <Header
          user={user}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="mx-auto w-full max-w-7xl px-2 py-8 sm:px-4 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
