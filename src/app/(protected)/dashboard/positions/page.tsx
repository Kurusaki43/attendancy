import { Briefcase } from 'lucide-react';

import { getListErrorStateProps } from '@/components/shared/data-table/data-table-utils';
import DataTablePagination from '@/components/shared/data-table/DataTablePagination';
import DataTableToolbar from '@/components/shared/data-table/DataTableToolbar';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { AddPositionDialog } from '@/features/positions/components/AddPositionDialog';
import { PositionsTable } from '@/features/positions/components/PositionsTable';
import { getAllPositionsAction } from '@/server/positions/actions/get-all-positions.action';

type PositionsPageProps = {
  searchParams: Promise<Record<string, string>>;
};

export default async function PositionsPage({ searchParams }: PositionsPageProps) {
  const params = await searchParams;
  const result = await getAllPositionsAction(params);
  const hasActiveFilters = Boolean(params.search) || Boolean(params.isActive);
  const isTrulyEmpty = result.success && result.data.positions.length === 0 && !hasActiveFilters;

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-6 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Positions</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Manage your organisation&apos;s positions and their status.
          </p>
        </div>
        {result.success && !isTrulyEmpty && <AddPositionDialog />}
      </div>
      {/* Content */}
      {result.success ? (
        isTrulyEmpty ? (
          <EmptyState
            icon={Briefcase}
            title="No positions yet"
            description="Create your first position to begin."
            action={<AddPositionDialog />}
            className="rounded-md border"
          />
        ) : (
          <>
            <DataTableToolbar />
            <PositionsTable positions={result.data.positions} />
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
          {...getListErrorStateProps(result.code, { resourceLabel: 'positions' })}
          className="rounded-md border"
        />
      )}
    </div>
  );
}
