import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <div className="space-y-4">
      <Card className="gap-0 overflow-hidden p-0">
        <Skeleton className="h-20 w-full rounded-none sm:h-24" />

        <CardContent className="relative px-6 pt-0 pb-6">
          <div className="-mt-10 flex items-end gap-4 sm:-mt-12">
            <Skeleton className="ring-background size-20 rounded-full ring-4" />
            <div className="space-y-2 pb-1">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>

          <Skeleton className="my-5 h-px w-full" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Skeleton className="h-9 w-48" />

      <Card>
        <CardContent className="space-y-4 pt-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
