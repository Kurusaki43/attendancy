import { StatCardSkeleton } from '@/components/shared/StatCardSkeleton';

export function DepartmentStatsSkeleton() {
  return (
    <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}
