import { UserAvatar } from '@/features/dashboard/components/UserAvatar';
import type { AttendanceEmployeeResult } from '@/server/attendance/types';

export function EmployeeCell({ employee }: { employee: AttendanceEmployeeResult }) {
  return (
    <div className="flex items-center gap-3">
      <UserAvatar
        firstName={employee.user.firstName}
        lastName={employee.user.lastName}
        avatar={employee.user.avatar}
      />
      <div>
        <span className="text-foreground block font-medium">
          {employee.user.firstName} {employee.user.lastName}
        </span>
        <span className="text-muted-foreground text-xs">{employee.employeeCode}</span>
      </div>
    </div>
  );
}
