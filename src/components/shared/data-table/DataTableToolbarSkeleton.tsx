import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DataTableToolbarSkeleton() {
  return (
    <Card size="sm" className="border-border border border-dashed shadow-none ring-0">
      <CardContent className="flex flex-wrap items-center justify-between gap-6">
        <Skeleton className="h-8 w-full max-w-xs" />

        <div className="flex flex-wrap items-center gap-6">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-40" />
        </div>
      </CardContent>
    </Card>
  );
}
