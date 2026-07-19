import { DataTablePaginationSkeleton } from '@/components/shared/data-table/DataTablePaginationSkeleton';
import { DataTableSkeleton } from '@/components/shared/data-table/DataTableSkeleton';
import { DataTableToolbarSkeleton } from '@/components/shared/data-table/DataTableToolbarSkeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const ATTENDANCE_COLUMN_COUNT = 7;

export default function AllAttendanceLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-6 pb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Attendance</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            View every employee&apos;s clock-in and clock-out history.
          </p>
        </div>
      </div>

      <Card className="bg-card border-border card-shadow">
        <CardHeader>
          <DataTableToolbarSkeleton />
        </CardHeader>
        <CardContent>
          <DataTableSkeleton columns={ATTENDANCE_COLUMN_COUNT} />
        </CardContent>
        <CardFooter className="block">
          <DataTablePaginationSkeleton />
        </CardFooter>
      </Card>
    </div>
  );
}
