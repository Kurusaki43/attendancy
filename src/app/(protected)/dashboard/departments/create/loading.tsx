import { Skeleton } from '@/components/ui/skeleton';
import { DepartmentFormSkeleton } from '@/features/departments/components/DepartmentFormSkeleton';

export default function CreateDepartmentLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-2 h-8 w-40" />
        <Skeleton className="h-7 w-52" />
        <Skeleton className="mt-1.5 h-4 w-72" />
      </div>

      <DepartmentFormSkeleton />
    </div>
  );
}
