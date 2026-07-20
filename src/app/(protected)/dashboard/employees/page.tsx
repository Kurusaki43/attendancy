import { Users } from 'lucide-react';

import { getListErrorStateProps } from '@/components/shared/data-table/data-table-utils';
import DataTablePagination from '@/components/shared/data-table/DataTablePagination';
import DataTableToolbar from '@/components/shared/data-table/DataTableToolbar';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { AddEmployeeButton } from '@/features/employees/components/AddEmployeeButton';
import { EmployeesTable } from '@/features/employees/components/EmployeesTable';
import { EmployeeStats } from '@/features/employees/components/EmployeeStats';
import {
  EMPLOYMENT_STATUS_LABELS,
  EMPLOYMENT_STATUSES,
} from '@/features/employees/lib/employment-status';
import { USER_STATUS_LABELS, USER_STATUSES } from '@/features/employees/lib/user-status';
import { getAllDepartmentsAction } from '@/server/departments/actions/get-all-departments.action';
import { getAllEmployeesAction } from '@/server/employees/actions/get-all-employees.action';
import { getEmployeeStatsAction } from '@/server/employees/actions/get-employee-stats.action';
import { getAllPositionsAction } from '@/server/positions/actions/get-all-positions.action';

const OPTIONS_QUERY = { limit: '100', isActive: 'true' };

type EmployeesPageProps = {
  searchParams: Promise<Record<string, string>>;
};

export default async function EmployeesPage({ searchParams }: EmployeesPageProps) {
  const params = await searchParams;
  const [result, statsResult, departmentsResult, positionsResult] = await Promise.all([
    getAllEmployeesAction(params),
    getEmployeeStatsAction(),
    getAllDepartmentsAction({ ...OPTIONS_QUERY, sort: 'name' }),
    getAllPositionsAction({ ...OPTIONS_QUERY, sort: 'title' }),
  ]);

  const stats = statsResult.success
    ? statsResult.data
    : { totalEmployees: 0, activeEmployees: 0, onLeaveEmployees: 0, inactiveEmployees: 0 };

  const departments = departmentsResult.success
    ? departmentsResult.data.departments.map((department) => ({
        id: department.id,
        label: department.name,
      }))
    : [];
  const positions = positionsResult.success
    ? positionsResult.data.positions.map((position) => ({
        id: position.id,
        label: position.title,
      }))
    : [];

  const hasActiveFilters =
    Boolean(params.search) ||
    Boolean(params.employmentStatus) ||
    Boolean(params.accountStatus) ||
    Boolean(params.departmentId) ||
    Boolean(params.positionId);
  const isTrulyEmpty = result.success && result.data.employees.length === 0 && !hasActiveFilters;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-6 pb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide">Employees</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Manage your organisation&apos;s employees and their employment details.
          </p>
        </div>
        {result.success && !isTrulyEmpty && <AddEmployeeButton />}
      </div>

      {/* Stats */}
      <EmployeeStats stats={stats} />

      {/* Content */}
      {result.success ? (
        isTrulyEmpty ? (
          <EmptyState
            icon={Users}
            title="No employees yet"
            description="Invite your first employee to begin."
            action={<AddEmployeeButton />}
            className="border-border bg-card card-shadow rounded-sm"
          />
        ) : (
          <Card className="bg-card border-border card-shadow">
            <CardHeader>
              <DataTableToolbar
                searchPlaceholder="Search by name, email, code, or phone"
                sortOptions={[
                  { label: 'Newest First', value: '-createdAt' },
                  { label: 'Oldest First', value: 'createdAt' },
                  { label: 'Name (A-Z)', value: 'name' },
                  { label: 'Name (Z-A)', value: '-name' },
                  { label: 'Code (A-Z)', value: 'employeeCode' },
                  { label: 'Code (Z-A)', value: '-employeeCode' },
                  { label: 'Recently Hired', value: '-hireDate' },
                  { label: 'Earliest Hired', value: 'hireDate' },
                  { label: 'Recently Updated', value: '-updatedAt' },
                ]}
                statusFilter={{
                  queryKey: 'employmentStatus',
                  label: 'Employment Status',
                  options: EMPLOYMENT_STATUSES.map((status) => ({
                    label: EMPLOYMENT_STATUS_LABELS[status],
                    value: status,
                  })),
                }}
                filters={[
                  {
                    queryKey: 'accountStatus',
                    label: 'Account Status',
                    options: USER_STATUSES.map((status) => ({
                      label: USER_STATUS_LABELS[status],
                      value: status,
                    })),
                  },
                  {
                    queryKey: 'departmentId',
                    label: 'Department',
                    options: departments.map((department) => ({
                      label: department.label,
                      value: department.id,
                    })),
                  },
                  {
                    queryKey: 'positionId',
                    label: 'Position',
                    options: positions.map((position) => ({
                      label: position.label,
                      value: position.id,
                    })),
                  },
                ]}
              />
            </CardHeader>
            <CardContent>
              <EmployeesTable employees={result.data.employees} />
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
          {...getListErrorStateProps(result.code, { resourceLabel: 'employees' })}
          className="border-border bg-card card-shadow rounded-sm"
        />
      )}
    </div>
  );
}
