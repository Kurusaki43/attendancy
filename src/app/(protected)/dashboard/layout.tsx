import type { ReactNode } from 'react';

import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { getCurrentUser } from '@/server/auth/lib/get-current-user';

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
