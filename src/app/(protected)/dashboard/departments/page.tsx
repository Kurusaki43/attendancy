import { Building2, Network } from 'lucide-react';
import Link from 'next/link';

import { getListErrorStateProps } from '@/components/shared/data-table/data-table-utils';
import DataTablePagination from '@/components/shared/data-table/DataTablePagination';
import DataTableToolbar from '@/components/shared/data-table/DataTableToolbar';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Button } from '@/components/ui/button';
import { AddDepartmentButton } from '@/features/departments/components/AddDepartmentButton';
import { DepartmentsTable } from '@/features/departments/components/DepartmentsTable';
import { DepartmentStats } from '@/features/departments/components/DepartmentStats';
import { getAllDepartmentsAction } from '@/server/departments/actions/get-all-departments.action';
import { getDepartmentStatsAction } from '@/server/departments/actions/get-department-stats.action';

type DepartmentsPageProps = {
  searchParams: Promise<Record<string, string>>;
};

export default async function DepartmentsPage({ searchParams }: DepartmentsPageProps) {
  const params = await searchParams;

  const [result, statsResult] = await Promise.all([
    getAllDepartmentsAction(params),
    getDepartmentStatsAction(),
  ]);

  const stats = statsResult.success
    ? statsResult.data
    : { totalDepartments: 0, totalEmployees: 0, averageDepartmentSize: 0 };

  const hasActiveFilters = Boolean(params.search) || Boolean(params.isActive);

  const isTrulyEmpty = result.success && result.data.departments.length === 0 && !hasActiveFilters;

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-6 pb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Departments</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Manage your organisation&apos;s departments and their status.
          </p>
        </div>
        {result.success && !isTrulyEmpty && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="/dashboard/departments/hierarchy" />}
            >
              <Network data-icon="inline-start" />
              View Hierarchy
            </Button>
            <AddDepartmentButton />
          </div>
        )}
      </div>

      {/* Stats */}
      <DepartmentStats stats={stats} />

      {/* Content */}
      {result.success ? (
        isTrulyEmpty ? (
          <EmptyState
            icon={Building2}
            title="No departments yet"
            description="Create your first department to begin."
            action={<AddDepartmentButton />}
            className="rounded-md border"
          />
        ) : (
          <>
            <DataTableToolbar searchPlaceholder="Search by name, code, or description" />
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
