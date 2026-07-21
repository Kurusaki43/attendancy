import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function SectionSkeleton({ fieldCount = 2 }: { fieldCount?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="size-6 shrink-0 rounded-md" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: fieldCount }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AttendanceFormSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6">
          <SectionSkeleton fieldCount={2} />
          <Skeleton className="h-px w-full" />
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 shrink-0 rounded-md" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-8 w-28" />
            </div>
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
          <Skeleton className="h-px w-full" />
          <SectionSkeleton fieldCount={2} />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
