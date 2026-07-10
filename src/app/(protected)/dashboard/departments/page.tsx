import { Building2 } from 'lucide-react';

import { getListErrorStateProps } from '@/components/shared/data-table/data-table-utils';
import DataTablePagination from '@/components/shared/data-table/DataTablePagination';
import DataTableToolbar from '@/components/shared/data-table/DataTableToolbar';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { AddDepartmentDialog } from '@/features/departments/components/AddDepartmentDialog';
import { DepartmentsTable } from '@/features/departments/components/DepartmentsTable';
import { getAllDepartmentsAction } from '@/server/departments/actions/get-all-departments.action';

type DepartmentsPageProps = {
  searchParams: Promise<Record<string, string>>;
};

export default async function DepartmentsPage({ searchParams }: DepartmentsPageProps) {
  const params = await searchParams;
  const result = await getAllDepartmentsAction(params);
  const hasActiveFilters = Boolean(params.search) || Boolean(params.isActive);
  const isTrulyEmpty = result.success && result.data.departments.length === 0 && !hasActiveFilters;

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-6 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Departments</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Manage your organisation&apos;s departments and their status.
          </p>
        </div>
        {result.success && !isTrulyEmpty && <AddDepartmentDialog />}
      </div>
      {/* Content */}
      {result.success ? (
        isTrulyEmpty ? (
          <EmptyState
            icon={Building2}
            title="No departments yet"
            description="Create your first department to begin."
            action={<AddDepartmentDialog />}
            className="rounded-md border"
          />
        ) : (
          <>
            <DataTableToolbar />
            <DepartmentsTable departments={result.data.departments} />
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
          {...getListErrorStateProps(result.code, { resourceLabel: 'departments' })}
          className="rounded-md border"
        />
      )}
    </div>
  );
}
