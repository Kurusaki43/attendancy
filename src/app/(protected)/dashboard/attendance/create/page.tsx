import { AttendanceForm } from '@/features/attendance/components/AttendanceForm';
import { toEmployeeOption } from '@/features/attendance/lib/attendance-employee-option';
import { getEmployeeAction } from '@/server/employees/actions/get-employee.action';
import { parseLocalDate } from '@/shared/utils/date';

type CreateAttendancePageProps = {
  searchParams: Promise<{ employeeId?: string; date?: string }>;
};

export default async function CreateAttendancePage({ searchParams }: CreateAttendancePageProps) {
  const { employeeId, date } = await searchParams;

  const employeeResult = employeeId ? await getEmployeeAction(employeeId) : undefined;
  const initialEmployee =
    employeeResult?.success && employeeResult.data ? toEmployeeOption(employeeResult.data) : null;
  const initialDate = date ? parseLocalDate(date) : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add Manual Attendance</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Create or adjust an employee&apos;s attendance record manually.
        </p>
      </div>

      <AttendanceForm mode="create" initialEmployee={initialEmployee} initialDate={initialDate} />
    </div>
  );
}
