import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function FieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-9 w-full rounded-md" />
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

        <div className="grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-2">
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>

        <div className="space-y-3 border-t pt-6">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-32 w-full rounded-md" />
        </div>
      </CardContent>
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
      </CardContent>
    </Card>
  );
}

export default function AttendanceDetailsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2">
          <DetailsCardSkeleton />
        </div>

        <div className="space-y-4">
          <SummaryCardSkeleton />
        </div>
      </div>
    </div>
  );
}
