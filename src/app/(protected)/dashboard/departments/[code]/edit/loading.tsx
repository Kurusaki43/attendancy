import { Skeleton } from '@/components/ui/skeleton';
import { DepartmentFormSkeleton } from '@/features/departments/components/DepartmentFormSkeleton';

export default function EditDepartmentLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-2 h-8 w-40" />
        <Skeleton className="h-7 w-48" />
        <Skeleton className="mt-1.5 h-4 w-64" />
      </div>

      <DepartmentFormSkeleton />
    </div>
  );
}
