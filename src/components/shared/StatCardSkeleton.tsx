import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StatCardSkeleton() {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-4">
        <Skeleton className="size-12 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-3 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}
