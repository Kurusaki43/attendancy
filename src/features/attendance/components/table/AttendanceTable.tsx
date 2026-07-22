'use client';

import { type LucideIcon, SearchX } from 'lucide-react';

import ClearFiltersButton from '@/components/shared/data-table/ClearFilterButton';
import { DataTable } from '@/components/shared/data-table/DataTable';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import type { AttendanceResult } from '@/server/attendance/types';

import { buildAttendanceColumns } from './attendance-columns';

type AttendanceTableProps = {
  attendance: AttendanceResult[];
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
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  emptyAction?: React.ReactNode;
};

export function AttendanceTable({
  attendance,
  showDepartment,
  showDate,
  showClockIn,
  showClockOut,
  showWorkedMinutes,
  showStatus,
  showCompletion,
  showSource,
  showActions,
  renderRowActions,
  emptyMessage = 'No matching attendance records',
  emptyDescription = 'Try adjusting your search or filters.',
  emptyIcon = SearchX,
  emptyAction = <ClearFiltersButton />,
}: AttendanceTableProps) {
  const userLocale = useUserLocale();

  return (
    <DataTable
      data={attendance}
      columns={buildAttendanceColumns({
        userLocale,
        showDepartment,
        showDate,
        showClockIn,
        showClockOut,
        showWorkedMinutes,
        showStatus,
        showCompletion,
        showSource,
        showActions,
        renderRowActions,
      })}
      emptyMessage={emptyMessage}
      emptyDescription={emptyDescription}
      emptyIcon={emptyIcon}
      emptyAction={emptyAction}
      getRowKey={(row) => row.id}
    />
  );
}
