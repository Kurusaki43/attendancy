import { DataTablePaginationSkeleton } from '@/components/shared/data-table/DataTablePaginationSkeleton';
import { DataTableSkeleton } from '@/components/shared/data-table/DataTableSkeleton';
import { DataTableToolbarSkeleton } from '@/components/shared/data-table/DataTableToolbarSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { DepartmentStatsSkeleton } from '@/features/departments/components/DepartmentStatsSkeleton';

const DEPARTMENTS_COLUMN_COUNT = 7;

export default function DepartmentsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-6 pb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Departments</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Manage your organisation&apos;s departments and their status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      <DepartmentStatsSkeleton />

      <DataTableToolbarSkeleton />
      <DataTableSkeleton columns={DEPARTMENTS_COLUMN_COUNT} />
      <DataTablePaginationSkeleton />
    </div>
  );
}
