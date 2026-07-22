import { notFound } from 'next/navigation';

import { AttendanceForm } from '@/features/attendance/components/AttendanceForm';
import { getAttendanceAction } from '@/server/attendance/actions/get-attendance.action';

type EditAttendancePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditAttendancePage({ params }: EditAttendancePageProps) {
  const { id } = await params;

  const attendanceResult = await getAttendanceAction(id);

  if (!attendanceResult.success) {
    notFound();
  }

  const attendance = attendanceResult.data;

  if (attendance.status === 'ON_LEAVE' || attendance.status === 'HOLIDAY') {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Attendance Record</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Update {attendance.employee.user.firstName} {attendance.employee.user.lastName}
          &apos;s attendance record.
        </p>
      </div>

      <AttendanceForm mode="update" attendance={attendance} />
    </div>
  );
}
