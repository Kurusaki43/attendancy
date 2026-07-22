import { Badge } from '@/components/ui/badge';
import {
  EMPLOYMENT_STATUS_BADGE_CLASSES,
  EMPLOYMENT_STATUS_DOT_CLASSES,
  EMPLOYMENT_STATUS_LABELS,
  type EmploymentStatus,
} from '@/features/employees/lib/employment-status';
import { cn } from '@/lib/utils';

export function EmploymentStatusBadge({ status }: { status: EmploymentStatus }) {
  return (
    <Badge className={cn('rounded-sm', EMPLOYMENT_STATUS_BADGE_CLASSES[status])}>
      <span
        className={cn('size-1.5 shrink-0 rounded-full', EMPLOYMENT_STATUS_DOT_CLASSES[status])}
      />
      {EMPLOYMENT_STATUS_LABELS[status]}
    </Badge>
  );
}
