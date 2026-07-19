import { CalendarDays } from 'lucide-react';

import { getListErrorStateProps } from '@/components/shared/data-table/data-table-utils';
import DataTablePagination from '@/components/shared/data-table/DataTablePagination';
import DataTableToolbar from '@/components/shared/data-table/DataTableToolbar';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { AttendanceTable } from '@/features/attendance/components/AttendanceTable';
import {
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUSES,
} from '@/features/attendance/lib/attendance-status';
import { getAllAttendanceAction } from '@/server/attendance/actions/get-all-attendance.action';
import { getAllDepartmentsAction } from '@/server/departments/actions/get-all-departments.action';

const DEPARTMENT_OPTIONS_QUERY = { limit: '100', isActive: 'true', sort: 'name' };

type AllAttendancePageProps = {
  searchParams: Promise<Record<string, string>>;
};

export default async function AllAttendancePage({ searchParams }: AllAttendancePageProps) {
  const params = await searchParams;

  const [result, departmentsResult] = await Promise.all([
    getAllAttendanceAction(params),
    getAllDepartmentsAction(DEPARTMENT_OPTIONS_QUERY),
  ]);

  const departments = departmentsResult.success
    ? departmentsResult.data.departments.map((department) => ({
        id: department.id,
        label: department.name,
      }))
    : [];

  const hasActiveFilters =
    Boolean(params.search) || Boolean(params.status) || Boolean(params.departmentId);
  const isTrulyEmpty = result.success && result.data.attendance.length === 0 && !hasActiveFilters;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-6 pb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide">All Attendance</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            View every employee&apos;s clock-in and clock-out history.
          </p>
        </div>
      </div>

      {/* Content */}
      {result.success ? (
        isTrulyEmpty ? (
          <EmptyState
            icon={CalendarDays}
            title="No attendance records yet"
            description="Records appear here once employees start clocking in."
            className="border-border bg-card card-shadow rounded-sm"
          />
        ) : (
          <Card className="bg-card border-border card-shadow">
            <CardHeader>
              <DataTableToolbar
                searchPlaceholder="Search by employee name or code"
                sortOptions={[
                  { label: 'Newest Date', value: '-date' },
                  { label: 'Oldest Date', value: 'date' },
                  { label: 'Most Worked', value: '-workedMinutes' },
                  { label: 'Least Worked', value: 'workedMinutes' },
                ]}
                statusFilter={{
                  queryKey: 'status',
                  label: 'Status',
                  options: ATTENDANCE_STATUSES.map((status) => ({
                    label: ATTENDANCE_STATUS_LABELS[status],
                    value: status,
                  })),
                }}
                filters={[
                  {
                    queryKey: 'departmentId',
                    label: 'Department',
                    options: departments.map((department) => ({
                      label: department.label,
                      value: department.id,
                    })),
                  },
                ]}
              />
            </CardHeader>
            <CardContent>
              <AttendanceTable attendance={result.data.attendance} />
            </CardContent>
            <CardFooter className="block">
              <DataTablePagination
                limit={result.data.pagination.limit}
                page={result.data.pagination.page}
                totalPages={result.data.pagination.totalPages}
                totalItems={result.data.pagination.totalItems}
              />
            </CardFooter>
          </Card>
        )
      ) : (
        <ErrorState
          {...getListErrorStateProps(result.code, { resourceLabel: 'attendance records' })}
          className="border-border bg-card card-shadow rounded-sm"
        />
      )}
    </div>
  );
}
