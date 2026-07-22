import { ChevronDown } from 'lucide-react';

import { UserAvatar } from '@/features/dashboard/components/UserAvatar';
import { cn } from '@/lib/utils';

export type AttendancePreviewEmployee = {
  firstName: string;
  lastName: string;
  avatar: string | null;
  employeeCode: string;
  position?: string | null;
  department?: string | null;
};

type AttendanceUserPreviewProps = {
  employee: AttendancePreviewEmployee | null;
  variant?: 'field' | 'plain';
  className?: string;
};

/** Employee avatar + name preview, reused as a read-only "field" look in the form and a
 * plain compact block in the summary sidebar. */
export function AttendanceUserPreview({
  employee,
  variant = 'plain',
  className,
}: AttendanceUserPreviewProps) {
  if (!employee) {
    return (
      <div
        className={cn(
          'text-muted-foreground flex h-11 items-center rounded-md border px-3 text-sm',
          className,
        )}
      >
        No employee selected
      </div>
    );
  }

  if (variant === 'field') {
    return (
      <div
        className={cn(
          'border-input bg-card flex h-11 w-full items-center justify-between gap-2 rounded-md border px-2.5 shadow-xs',
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <UserAvatar
            firstName={employee.firstName}
            lastName={employee.lastName}
            avatar={employee.avatar}
            size="sm"
            className="shrink-0"
          />
          <span className="truncate text-sm font-medium">
            {employee.firstName} {employee.lastName}{' '}
            <span className="text-muted-foreground font-normal">({employee.employeeCode})</span>
          </span>
        </div>
        <ChevronDown className="text-muted-foreground size-4 shrink-0" />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <UserAvatar
        firstName={employee.firstName}
        lastName={employee.lastName}
        avatar={employee.avatar}
        size="sm"
        className="shrink-0"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {employee.firstName} {employee.lastName}
        </p>
        <p className="text-muted-foreground truncate text-xs">{employee.employeeCode}</p>
      </div>
    </div>
  );
}
