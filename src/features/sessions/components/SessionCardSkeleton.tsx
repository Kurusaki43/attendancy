import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SessionCardSkeleton() {
  return (
    <Card className="gap-3 px-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full" />

          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <Skeleton className="h-6 w-16" />
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="ml-auto h-3 w-20" />

        <Skeleton className="h-3 w-16" />
        <Skeleton className="ml-auto h-3 w-20" />

        <Skeleton className="h-3 w-12" />
        <Skeleton className="ml-auto h-3 w-20" />
      </dl>
    </Card>
  );
}
