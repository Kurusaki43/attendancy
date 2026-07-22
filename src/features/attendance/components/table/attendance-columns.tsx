import type { ColumnDef } from '@/components/shared/data-table/DataTable';
import { formatWorkedMinutes } from '@/features/attendance/lib/format-worked-date';
import type { AttendanceResult } from '@/server/attendance/types';
import { DATE_FORMAT, formatDate, TIME_FORMAT } from '@/shared/utils/format-date';

import { AttendanceRowActions } from './AttendanceRowActions';
import { AttendanceStatusBadge } from './cells/AttendanceStatusBadge';
import { CompletionStatusBadge } from './cells/CompletionStatusBadge';
import { DepartmentCell } from './cells/DepartmentCell';
import { EmployeeCell } from './cells/EmployeeCell';
import { SourceBadge } from './cells/SourceBadge';

type UserLocale = { locale?: string; timezone?: string };

function formatClockTime(value: Date | null, userLocale: UserLocale) {
  if (!value) return <span className="italic opacity-50">—</span>;

  return formatDate(value, { ...userLocale, ...TIME_FORMAT });
}

export type AttendanceColumnOptions = {
  userLocale: UserLocale;
  showDepartment?: boolean;
  showDate?: boolean;
  showClockIn?: boolean;
  showClockOut?: boolean;
  showWorkedMinutes?: boolean;
  showStatus?: boolean;
  showCompletion?: boolean;
  showSource?: boolean;
  showActions?: boolean;
  renderRowActions?: (attendance: AttendanceResult) => React.ReactNode;
};

export function buildAttendanceColumns({
  userLocale,
  showDepartment = true,
  showDate = true,
  showClockIn = true,
  showClockOut = true,
  showWorkedMinutes = true,
  showStatus = true,
  showCompletion = true,
  showSource = true,
  showActions = true,
  renderRowActions = (attendance) => <AttendanceRowActions attendance={attendance} />,
}: AttendanceColumnOptions): ColumnDef<AttendanceResult>[] {
  const columns: ColumnDef<AttendanceResult>[] = [
    {
      key: 'employee',
      header: 'Employee',
      cell: (row) => <EmployeeCell employee={row.employee} />,
    },
  ];

  if (showDepartment) {
    columns.push({
      key: 'department',
      header: 'Department',
      cell: (row) => <DepartmentCell department={row.employee.department} />,
    });
  }

  if (showDate) {
    columns.push({
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
    });
  }

  if (showClockIn) {
    columns.push({
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
    });
  }

  if (showClockOut) {
    columns.push({
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
    });
  }

  if (showWorkedMinutes) {
    columns.push({
      key: 'workedMinutes',
      header: 'Worked',
      cell: (row) => (
        <span className="text-muted-foreground block text-center tabular-nums">
          {formatWorkedMinutes(row.workedMinutes)}
        </span>
      ),
      headerClassName: 'text-center',
      cellClassName: 'text-center',
    });
  }

  if (showStatus) {
    columns.push({
      key: 'status',
      header: 'Status',
      cell: (row) => <AttendanceStatusBadge status={row.status} />,
    });
  }

  if (showCompletion) {
    columns.push({
      key: 'completion',
      header: 'Completion',
      cell: (row) => <CompletionStatusBadge completionStatus={row.completionStatus} />,
      headerClassName: 'text-center',
      cellClassName: 'text-center',
    });
  }

  if (showSource) {
    columns.push({
      key: 'source',
      header: 'Source',
      cell: (row) => <SourceBadge hasManualChanges={row.hasManualChanges} />,
      headerClassName: 'text-center',
      cellClassName: 'text-center',
    });
  }

  if (showActions) {
    columns.push({
      key: 'actions',
      header: 'Actions',
      cell: (row) => renderRowActions(row),
      headerClassName: 'text-center',
      cellClassName: 'text-center',
    });
  }

  return columns;
}
