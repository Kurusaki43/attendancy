import Link from 'next/link';

import { Logo } from '@/components/shared/Logo';
import { AttendanceQrScanner } from '@/features/attendance/components/AttendanceQrScanner';
import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { hasPermission } from '@/server/auth/guards/require-permission';
import { getCurrentUser } from '@/server/auth/lib/get-current-user';

export default async function ScanQrPage() {
  const user = await getCurrentUser();
  const canScan = hasPermission(user, PERMISSIONS.ATTENDANCE_SCAN_QR);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="flex items-center justify-center gap-3 py-8">
        <Logo size="lg" />
        <div>
          <p className="text-lg font-semibold tracking-wide">Attendancy</p>
          <p className="text-muted-foreground text-xs">Employee Check-In</p>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 px-3">
        {canScan ? (
          <AttendanceQrScanner />
        ) : (
          <p className="text-muted-foreground max-w-sm text-center text-sm">
            Your account doesn&apos;t have permission to clock in or out.
          </p>
        )}

        <Link href="/dashboard" className="text-muted-foreground text-sm underline">
          Cancel
        </Link>
      </main>
    </div>
  );
}
