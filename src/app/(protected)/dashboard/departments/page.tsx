import DataTablePagination from '@/components/shared/data-table/DataTablePagination';
import DataTableToolbar from '@/components/shared/data-table/DataTableToolbar';
import { getAllDepartmentsAction } from '@/features/departments';
import { AddDepartmentDialog } from '@/features/departments/components/AddDepartmentDialog';
import { DepartmentsTable } from '@/features/departments/components/DepartmentsTable';

type DepartmentsPageProps = {
  searchParams: Promise<Record<string, string>>;
};

export default async function DepartmentsPage({ searchParams }: DepartmentsPageProps) {
  const params = await searchParams;
  const result = await getAllDepartmentsAction(params);

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
        <AddDepartmentDialog />
      </div>
      <DataTableToolbar />
      {/* Content */}
      {result.success ? (
        <>
          <DepartmentsTable departments={result.data.departments} />
          <DataTablePagination
            limit={result.data.pagination.limit}
            page={result.data.pagination.page}
            totalPages={result.data.pagination.totalPages}
            totalItems={result.data.pagination.totalItems}
          />
        </>
      ) : (
        <div className="bg-destructive/5 border-destructive/20 rounded-md border px-4 py-3">
          <p className="text-destructive text-sm font-medium">
            {result.message ?? 'Failed to load departments.'}
          </p>
        </div>
      )}
    </div>
  );
}
