import type { ReactNode } from 'react';

import { getCurrentUser } from '@/features/auth/lib/get-current-user';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
