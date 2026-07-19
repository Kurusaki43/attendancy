import { DataTablePaginationSkeleton } from '@/components/shared/data-table/DataTablePaginationSkeleton';
import { DataTableSkeleton } from '@/components/shared/data-table/DataTableSkeleton';
import { DataTableToolbarSkeleton } from '@/components/shared/data-table/DataTableToolbarSkeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PositionStatsSkeleton } from '@/features/positions/components/PositionStatsSkeleton';

const POSITIONS_COLUMN_COUNT = 5;

export default function PositionsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-6 pb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Positions</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Manage your organisation&apos;s positions and their status.
          </p>
        </div>
        <Skeleton className="h-9 w-40" />
      </div>

      <PositionStatsSkeleton />

      <Card className="bg-card border-border card-shadow rounded-sm">
        <CardHeader>
          <DataTableToolbarSkeleton />
        </CardHeader>
        <CardContent>
          <DataTableSkeleton columns={POSITIONS_COLUMN_COUNT} />
        </CardContent>
        <CardFooter className="block">
          <DataTablePaginationSkeleton />
        </CardFooter>
      </Card>
    </div>
  );
}
