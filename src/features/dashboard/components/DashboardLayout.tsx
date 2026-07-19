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
  // useSyncExternalStore (not a lazy initializer) is what actually avoids the hydration
  // mismatch: React renders the server snapshot (false) on the client's first pass to match
  // SSR exactly, then synchronously swaps to the real localStorage value right after hydration
  // commits — no per-element suppressHydrationWarning needed anywhere in the subtree.
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
