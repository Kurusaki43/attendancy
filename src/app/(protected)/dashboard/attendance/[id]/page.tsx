import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { AttendanceDetailsView } from '@/features/attendance/components/AttendanceDetailsView';
import { AttendanceSummaryView } from '@/features/attendance/components/AttendanceSummaryView';
import { getAttendanceAction } from '@/server/attendance/actions/get-attendance.action';

type AttendanceDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AttendanceDetailsPage({ params }: AttendanceDetailsPageProps) {
  const { id } = await params;

  const attendanceResult = await getAttendanceAction(id);

  if (!attendanceResult.success) {
    notFound();
  }

  const attendance = attendanceResult.data;
  const isEditable = attendance.status !== 'ON_LEAVE' && attendance.status !== 'HOLIDAY';

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Attendance Details</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Viewing {attendance.employee.user.firstName} {attendance.employee.user.lastName}
            &apos;s attendance record.
          </p>
        </div>

        {isEditable && (
          <Button
            variant="outline"
            nativeButton={false}
            className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
            render={<Link href={`/dashboard/attendance/${id}/edit`} />}
          >
            <PencilIcon data-icon="inline-start" />
            Edit Attendance
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2">
          <AttendanceDetailsView attendance={attendance} />
        </div>

        <div className="space-y-4">
          <AttendanceSummaryView attendance={attendance} />
        </div>
      </div>
    </div>
  );
}
