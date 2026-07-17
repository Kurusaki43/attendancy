import { Skeleton } from '@/components/ui/skeleton';

export default function DepartmentHierarchyLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-2 h-8 w-40" />
        <Skeleton className="h-7 w-64" />
        <Skeleton className="mt-1.5 h-4 w-80" />
      </div>

      <Skeleton className="h-[70vh] w-full rounded-lg" />
    </div>
  );
}
