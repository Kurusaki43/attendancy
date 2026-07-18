import { Skeleton } from '@/components/ui/skeleton';
import { EmployeeFormSkeleton } from '@/features/employees/components/EmployeeFormSkeleton';

export default function CreateEmployeeLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-2 h-8 w-40" />
        <Skeleton className="h-7 w-44" />
        <Skeleton className="mt-1.5 h-4 w-96" />
      </div>

      <EmployeeFormSkeleton />
    </div>
  );
}
