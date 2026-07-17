import { Users } from 'lucide-react';

import { getListErrorStateProps } from '@/components/shared/data-table/data-table-utils';
import DataTablePagination from '@/components/shared/data-table/DataTablePagination';
import DataTableToolbar from '@/components/shared/data-table/DataTableToolbar';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { AddEmployeeDialog } from '@/features/employees/components/AddEmployeeDialog';
import { EmployeesTable } from '@/features/employees/components/EmployeesTable';
import { getAllDepartmentsAction } from '@/server/departments/actions/get-all-departments.action';
import { getAllEmployeesAction } from '@/server/employees/actions/get-all-employees.action';
import { getAllPositionsAction } from '@/server/positions/actions/get-all-positions.action';

// Select options for the add/edit dialogs — active records only, capped at the max page size.
const OPTIONS_QUERY = { limit: '100', isActive: 'true' };

type EmployeesPageProps = {
  searchParams: Promise<Record<string, string>>;
};

export default async function EmployeesPage({ searchParams }: EmployeesPageProps) {
  const params = await searchParams;
  const [result, departmentsResult, positionsResult, managersResult] = await Promise.all([
    getAllEmployeesAction(params),
    getAllDepartmentsAction({ ...OPTIONS_QUERY, sort: 'name' }),
    getAllPositionsAction({ ...OPTIONS_QUERY, sort: 'title' }),
    getAllEmployeesAction(OPTIONS_QUERY),
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
  const managers = managersResult.success
    ? managersResult.data.employees.map((employee) => ({
        id: employee.id,
        label: `${employee.user.firstName} ${employee.user.lastName}`,
      }))
    : [];

  const hasActiveFilters =
    Boolean(params.search) ||
    Boolean(params.isActive) ||
    Boolean(params.departmentId) ||
    Boolean(params.positionId);
  const isTrulyEmpty = result.success && result.data.employees.length === 0 && !hasActiveFilters;

  const addEmployeeDialog = (
    <AddEmployeeDialog departments={departments} positions={positions} managers={managers} />
  );

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-6 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Manage your organisation&apos;s employees and their employment details.
          </p>
        </div>
        {result.success && !isTrulyEmpty && addEmployeeDialog}
      </div>
      {/* Content */}
      {result.success ? (
        isTrulyEmpty ? (
          <EmptyState
            icon={Users}
            title="No employees yet"
            description="Invite your first employee to begin."
            action={addEmployeeDialog}
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
              filters={[
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
            <EmployeesTable
              employees={result.data.employees}
              departments={departments}
              positions={positions}
              managers={managers}
            />
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
