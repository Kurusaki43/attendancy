import { Skeleton } from '@/components/ui/skeleton';
import { AttendanceFormSkeleton } from '@/features/attendance/components/AttendanceFormSkeleton';

export default function CreateAttendanceLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-2 h-4 w-40" />
        <Skeleton className="h-7 w-56" />
        <Skeleton className="mt-1.5 h-4 w-96" />
      </div>

      <AttendanceFormSkeleton />
    </div>
  );
}
