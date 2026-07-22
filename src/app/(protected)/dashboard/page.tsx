import { AttendanceCheckInCard } from '@/features/attendance/components/AttendanceCheckInCard';
import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { hasPermission } from '@/server/auth/guards/require-permission';
import { getCurrentUser } from '@/server/auth/lib/get-current-user';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const canCheckIn = hasPermission(user, PERMISSIONS.ATTENDANCE_SCAN_QR);

  return (
    <div className="space-y-6">
      {canCheckIn && (
        <div className="max-w-md">
          <AttendanceCheckInCard />
        </div>
      )}
    </div>
  );
}
