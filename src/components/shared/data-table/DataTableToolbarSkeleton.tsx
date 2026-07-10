import { Skeleton } from '@/components/ui/skeleton';

export function DataTableToolbarSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Skeleton className="h-8 w-full max-w-xs" />

      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-40" />
      </div>
    </div>
  );
}
