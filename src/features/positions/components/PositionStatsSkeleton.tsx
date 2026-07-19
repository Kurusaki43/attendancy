import { StatCardSkeleton } from '@/components/shared/StatCardSkeleton';

export function PositionStatsSkeleton() {
  return (
    <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}
