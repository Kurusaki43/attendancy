import { DataTableSkeleton } from '@/components/shared/data-table/DataTableSkeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DepartmentDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Skeleton className="mb-2 h-8 w-40" />
          <Skeleton className="h-7 w-56" />
          <Skeleton className="mt-1.5 h-4 w-72" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Card className="bg-card border-border card-shadow flex-1">
          <CardContent className="flex flex-col gap-6 sm:flex-row">
            <Skeleton className="size-20 shrink-0 rounded-xl" />
            <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border card-shadow w-full sm:w-80">
          <CardContent className="flex flex-col gap-4">
            <Skeleton className="h-5 w-40" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="size-8 shrink-0 rounded-md" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border card-shadow">
        <CardHeader className="flex-row items-center justify-between">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-8 w-36" />
        </CardHeader>
        <CardContent>
          <DataTableSkeleton columns={6} rows={5} />
        </CardContent>
      </Card>
    </div>
  );
}
