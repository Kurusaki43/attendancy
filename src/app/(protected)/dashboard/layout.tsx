import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
