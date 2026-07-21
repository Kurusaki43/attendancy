'use client';

import { Building2, PencilIcon, SearchX } from 'lucide-react';
import Link from 'next/link';

import ClearFiltersButton from '@/components/shared/data-table/ClearFilterButton';
import { type ColumnDef, DataTable } from '@/components/shared/data-table/DataTable';
import { TableRowActions } from '@/components/shared/data-table/TableRowActions';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  ATTENDANCE_COMPLETION_STATUS_BADGE_CLASSES,
  ATTENDANCE_COMPLETION_STATUS_DOT_CLASSES,
  ATTENDANCE_COMPLETION_STATUS_LABELS,
  ATTENDANCE_STATUS_BADGE_CLASSES,
  ATTENDANCE_STATUS_DOT_CLASSES,
  ATTENDANCE_STATUS_LABELS,
  formatWorkedMinutes,
} from '@/features/attendance/lib/attendance-status';
import { UserAvatar } from '@/features/dashboard/components/UserAvatar';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import { DEPARTMENT_ICON_MAP } from '@/features/departments/lib/department-visuals';
import { cn } from '@/lib/utils';
import type { AttendanceEmployeeResult, AttendanceResult } from '@/server/attendance/types';
import { DATE_FORMAT, formatDate, TIME_FORMAT } from '@/shared/utils/format-date';

function DepartmentCell({ department }: { department: AttendanceEmployeeResult['department'] }) {
  if (!department) {
    return <span className="text-muted-foreground italic opacity-50">None</span>;
  }

  const Icon = (department.icon && DEPARTMENT_ICON_MAP.get(department.icon)) || Building2;

  return (
    <Badge variant="outline" className="gap-1.5 font-normal">
      <span
        className={cn(
          'flex size-3.5 shrink-0 items-center justify-center rounded-sm text-white',
          department.color || 'bg-muted-foreground',
        )}
      >
        {/* eslint-disable-next-line react-hooks/static-components */}
        <Icon className="size-2.5" />
      </span>
      {department.name}
    </Badge>
  );
}

function StatusBadge({ status }: { status: AttendanceResult['status'] }) {
  return (
    <Badge className={cn('rounded-sm', ATTENDANCE_STATUS_BADGE_CLASSES[status])}>
      <span
        className={cn('size-1.5 shrink-0 rounded-full', ATTENDANCE_STATUS_DOT_CLASSES[status])}
      />
      {ATTENDANCE_STATUS_LABELS[status]}
    </Badge>
  );
}

function CompletionBadge({
  completionStatus,
}: {
  completionStatus: AttendanceResult['completionStatus'];
}) {
  if (!completionStatus) {
    return <span className="text-muted-foreground italic opacity-50">—</span>;
  }

  return (
    <Badge
      className={cn('rounded-sm', ATTENDANCE_COMPLETION_STATUS_BADGE_CLASSES[completionStatus])}
    >
      <span
        className={cn(
          'size-1.5 shrink-0 rounded-full',
          ATTENDANCE_COMPLETION_STATUS_DOT_CLASSES[completionStatus],
        )}
      />
      {ATTENDANCE_COMPLETION_STATUS_LABELS[completionStatus]}
    </Badge>
  );
}

function RowActions({ attendance }: { attendance: AttendanceResult }) {
  const isEditable = attendance.status !== 'ON_LEAVE' && attendance.status !== 'HOLIDAY';

  return (
    <TableRowActions
      label={`Actions for ${attendance.employee.user.firstName} ${attendance.employee.user.lastName}`}
    >
      {isEditable ? (
        <DropdownMenuItem
          className="cursor-pointer"
          render={<Link href={`/dashboard/attendance/${attendance.id}/edit`} />}
        >
          <PencilIcon />
          Edit
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem disabled>
          <PencilIcon />
          Edit
        </DropdownMenuItem>
      )}
    </TableRowActions>
  );
}

type UserLocale = { locale?: string; timezone?: string };

function formatClockTime(value: Date | null, userLocale: UserLocale) {
  if (!value) return <span className="italic opacity-50">—</span>;

  return formatDate(value, { ...userLocale, ...TIME_FORMAT });
}

function buildColumns(userLocale: UserLocale): ColumnDef<AttendanceResult>[] {
  return [
    {
      key: 'employee',
      header: 'Employee',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <UserAvatar
            firstName={row.employee.user.firstName}
            lastName={row.employee.user.lastName}
            avatar={row.employee.user.avatar}
          />
          <div>
            <span className="text-foreground block font-medium">
              {row.employee.user.firstName} {row.employee.user.lastName}
            </span>
            <span className="text-muted-foreground text-xs">{row.employee.employeeCode}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      cell: (row) => <DepartmentCell department={row.employee.department} />,
    },
    {
      key: 'date',
      header: 'Date',
      cell: (row) => (
        <span
          className="text-muted-foreground block text-center tabular-nums"
          suppressHydrationWarning
        >
          {formatDate(row.date, { ...userLocale, ...DATE_FORMAT })}
        </span>
      ),
      headerClassName: 'text-center',
      cellClassName: 'text-center',
    },
    {
      key: 'clockIn',
      header: 'Clock In',
      cell: (row) => (
        <span
          className="text-muted-foreground block text-center tabular-nums"
          suppressHydrationWarning
        >
          {formatClockTime(row.firstClockIn, userLocale)}
        </span>
      ),
      headerClassName: 'text-center',
      cellClassName: 'text-center',
    },
    {
      key: 'clockOut',
      header: 'Clock Out',
      cell: (row) => (
        <span
          className="text-muted-foreground block text-center tabular-nums"
          suppressHydrationWarning
        >
          {formatClockTime(row.lastClockOut, userLocale)}
        </span>
      ),
      headerClassName: 'text-center',
      cellClassName: 'text-center',
    },
    {
      key: 'workedMinutes',
      header: 'Worked',
      cell: (row) => (
        <span className="text-muted-foreground block text-center tabular-nums">
          {formatWorkedMinutes(row.workedMinutes)}
        </span>
      ),
      headerClassName: 'text-center',
      cellClassName: 'text-center',
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'completion',
      header: 'Completion',
      cell: (row) => <CompletionBadge completionStatus={row.completionStatus} />,
      headerClassName: 'text-center',
      cellClassName: 'text-center',
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => <RowActions attendance={row} />,
      headerClassName: 'text-center',
      cellClassName: 'text-center',
    },
  ];
}

type AttendanceTableProps = {
  attendance: AttendanceResult[];
};

export function AttendanceTable({ attendance }: AttendanceTableProps) {
  const userLocale = useUserLocale();

  return (
    <DataTable
      data={attendance}
      columns={buildColumns(userLocale)}
      emptyMessage="No matching attendance records"
      emptyDescription="Try adjusting your search or filters."
      emptyIcon={SearchX}
      emptyAction={<ClearFiltersButton />}
      getRowKey={(row) => row.id}
    />
  );
}
