import type { EmployeeResult } from '@/server/employees/types/action-results';

export function PositionCell({ position }: { position: EmployeeResult['position'] }) {
  return <span>{position?.title ?? <span className="italic opacity-50">None</span>}</span>;
}
