'use client';

import { type ReactNode, useState } from 'react';

import type { AuthUser } from '@/features/auth/types';

import { NAV_GROUPS } from '../config/navigation.config';
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
      <div className="flex h-full w-full flex-col">
        <Header
          user={user}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="mx-auto w-full max-w-7xl overflow-auto px-4 py-10 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
