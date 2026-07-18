import { Users } from 'lucide-react';

import { getListErrorStateProps } from '@/components/shared/data-table/data-table-utils';
import DataTablePagination from '@/components/shared/data-table/DataTablePagination';
import DataTableToolbar from '@/components/shared/data-table/DataTableToolbar';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { AddEmployeeButton } from '@/features/employees/components/AddEmployeeButton';
import { EmployeesTable } from '@/features/employees/components/EmployeesTable';
import {
  EMPLOYMENT_STATUS_LABELS,
  EMPLOYMENT_STATUSES,
} from '@/features/employees/lib/employment-status';
import { USER_STATUS_LABELS, USER_STATUSES } from '@/features/employees/lib/user-status';
import { getAllDepartmentsAction } from '@/server/departments/actions/get-all-departments.action';
import { getAllEmployeesAction } from '@/server/employees/actions/get-all-employees.action';
import { getAllPositionsAction } from '@/server/positions/actions/get-all-positions.action';

// Select options for the toolbar filters — active records only, capped at the max page size.
const OPTIONS_QUERY = { limit: '100', isActive: 'true' };

type EmployeesPageProps = {
  searchParams: Promise<Record<string, string>>;
};

export default async function EmployeesPage({ searchParams }: EmployeesPageProps) {
  const params = await searchParams;
  const [result, departmentsResult, positionsResult] = await Promise.all([
    getAllEmployeesAction(params),
    getAllDepartmentsAction({ ...OPTIONS_QUERY, sort: 'name' }),
    getAllPositionsAction({ ...OPTIONS_QUERY, sort: 'title' }),
  ]);

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
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-6 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide">Employees</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Manage your organisation&apos;s employees and their employment details.
          </p>
        </div>
        {result.success && !isTrulyEmpty && <AddEmployeeButton />}
      </div>
      {/* Content */}
      {result.success ? (
        isTrulyEmpty ? (
          <EmptyState
            icon={Users}
            title="No employees yet"
            description="Invite your first employee to begin."
            action={<AddEmployeeButton />}
            className="rounded-md border"
          />
        ) : (
          <>
            <DataTableToolbar
              searchPlaceholder="Search by employee code or phone"
              sortOptions={[
                { label: 'Newest First', value: '-createdAt' },
                { label: 'Oldest First', value: 'createdAt' },
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
            <EmployeesTable employees={result.data.employees} />
            <DataTablePagination
              limit={result.data.pagination.limit}
              page={result.data.pagination.page}
              totalPages={result.data.pagination.totalPages}
              totalItems={result.data.pagination.totalItems}
            />
          </>
        )
      ) : (
        <ErrorState
          {...getListErrorStateProps(result.code, { resourceLabel: 'employees' })}
          className="rounded-md border"
        />
      )}
    </div>
  );
}
