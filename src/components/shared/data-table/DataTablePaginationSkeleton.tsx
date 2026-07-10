import { Skeleton } from '@/components/ui/skeleton';

export function DataTablePaginationSkeleton() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <Skeleton className="h-4 w-40" />

      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-8 w-28" />

        <div className="flex items-center gap-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="size-8" />
          ))}
        </div>
      </div>
    </div>
  );
}
