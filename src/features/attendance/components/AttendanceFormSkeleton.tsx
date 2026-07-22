import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function FieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-11 w-full rounded-md" />
    </div>
  );
}

function DetailsCardSkeleton() {
  return (
    <Card className="card-shadow">
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldSkeleton />
          <FieldSkeleton />
        </div>

        <div className="space-y-3 border-t pt-6">
          <Skeleton className="h-3.5 w-36" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        </div>

        <div className="space-y-3 border-t pt-6">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-28" />
          </div>

          <div className="overflow-hidden rounded-md border">
            <div className="bg-muted/40 flex items-center gap-4 border-b p-2.5">
              <Skeleton className="h-3 w-4" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 border-b p-2.5 last:border-b-0">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-9 w-36 rounded-md" />
                <Skeleton className="h-9 w-32 rounded-md" />
                <Skeleton className="h-9 flex-1 rounded-md" />
                <Skeleton className="mx-auto size-8 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-end gap-2 border-t">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-36" />
      </CardFooter>
    </Card>
  );
}

function SummaryCardSkeleton() {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <Skeleton className="h-4 w-36" />
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-1.5 border-t pt-4 first:border-t-0 first:pt-0">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
        <Skeleton className="h-16 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

export function AttendanceFormSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="col-span-1 lg:col-span-2">
        <DetailsCardSkeleton />
      </div>

      <div className="space-y-4">
        <SummaryCardSkeleton />
      </div>
    </div>
  );
}
