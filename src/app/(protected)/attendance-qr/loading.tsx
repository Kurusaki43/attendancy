import { Skeleton } from '@/components/ui/skeleton';

export default function AttendanceQrLoading() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <Skeleton className="h-96 w-full max-w-sm" />
    </div>
  );
}
