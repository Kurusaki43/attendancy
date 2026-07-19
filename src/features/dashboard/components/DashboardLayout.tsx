'use client';

import { type ReactNode, useState, useSyncExternalStore } from 'react';

import { NAV_GROUPS } from '@/features/dashboard/config/navigation.config';
import {
  getSidebarCollapsed,
  getSidebarCollapsedServerSnapshot,
  setSidebarCollapsed,
  subscribeSidebarCollapsed,
} from '@/features/dashboard/lib/sidebar-collapsed-store';
import type { AuthUser } from '@/server/auth/types';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

type DashboardLayoutProps = {
  children: ReactNode;
  user: AuthUser;
};

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isCollapsed = useSyncExternalStore(
    subscribeSidebarCollapsed,
    getSidebarCollapsed,
    getSidebarCollapsedServerSnapshot,
  );

  function toggleCollapsed() {
    setSidebarCollapsed(!isCollapsed);
  }

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar
        user={user}
        navGroups={NAV_GROUPS}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapsed={toggleCollapsed}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={user}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1800px] p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
