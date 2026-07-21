import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function CardTitleSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="size-6 shrink-0 rounded-md" />
      <Skeleton className="h-4 w-36" />
    </div>
  );
}

function FieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-11 w-full rounded-md" />
    </div>
  );
}

function EmployeeDateCardSkeleton() {
  return (
    <Card className="card-shadow">
      <CardHeader className="flex items-center gap-2 space-y-0">
        <CardTitleSkeleton />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <FieldSkeleton />
        <FieldSkeleton />
        <Skeleton className="h-14 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

function AdditionalInfoCardSkeleton() {
  return (
    <Card className="card-shadow">
      <CardHeader className="flex items-center gap-2 space-y-0">
        <CardTitleSkeleton />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

function EventsCardSkeleton() {
  return (
    <Card className="card-shadow">
      <CardHeader className="flex items-center justify-between gap-2 space-y-0">
        <CardTitleSkeleton />
        <Skeleton className="h-8 w-28" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-3 w-64" />

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

        <div className="bg-muted/50 grid grid-cols-2 gap-4 rounded-md border p-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-14" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TimelinePreviewCardSkeleton() {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="space-y-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex gap-3">
            <Skeleton className="size-7 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AttendanceFormSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="col-span-1 space-y-4 lg:col-span-2">
        <div className="flex flex-col gap-4 sm:flex-row [&>*]:flex-1">
          <EmployeeDateCardSkeleton />
          <AdditionalInfoCardSkeleton />
        </div>

        <EventsCardSkeleton />
      </div>

      <div className="space-y-4">
        <TimelinePreviewCardSkeleton />
        <Skeleton className="h-20 w-full rounded-md" />

        <div className="flex justify-end gap-2 sm:justify-end">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  );
}
