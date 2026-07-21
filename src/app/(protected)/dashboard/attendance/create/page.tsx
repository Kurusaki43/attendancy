import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { AttendanceForm } from '@/features/attendance/components/AttendanceForm';
import { toEmployeeOption } from '@/features/attendance/lib/attendance-employee-option';
import { getEmployeeAction } from '@/server/employees/actions/get-employee.action';

type CreateAttendancePageProps = {
  searchParams: Promise<{ employeeId?: string; date?: string }>;
};

function parseLocalDate(isoDate: string): Date | undefined {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

export default async function CreateAttendancePage({ searchParams }: CreateAttendancePageProps) {
  const { employeeId, date } = await searchParams;

  const employeeResult = employeeId ? await getEmployeeAction(employeeId) : undefined;
  const initialEmployee =
    employeeResult?.success && employeeResult.data ? toEmployeeOption(employeeResult.data) : null;
  const initialDate = date ? parseLocalDate(date) : undefined;

  return (
    <div className="space-y-6">
      <div>
        <nav className="text-muted-foreground mb-2 flex items-center gap-1.5 text-sm">
          <Link href="/dashboard/attendance/all" className="hover:text-foreground">
            Attendance
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href="/dashboard/attendance/all" className="hover:text-foreground">
            Manual Attendance
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">Add</span>
        </nav>
        <h1 className="text-2xl font-semibold tracking-tight">Add Manual Attendance</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Create or adjust an employee&apos;s attendance record manually.
        </p>
      </div>

      <AttendanceForm mode="create" initialEmployee={initialEmployee} initialDate={initialDate} />
    </div>
  );
}
