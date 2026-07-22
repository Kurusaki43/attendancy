import { Badge } from '@/components/ui/badge';
import {
  USER_STATUS_BADGE_CLASSES,
  USER_STATUS_DOT_CLASSES,
  USER_STATUS_LABELS,
  type UserStatus,
} from '@/features/employees/lib/user-status';
import { cn } from '@/lib/utils';

export function AccountStatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge className={cn('rounded-sm', USER_STATUS_BADGE_CLASSES[status])}>
      <span className={cn('size-1.5 shrink-0 rounded-full', USER_STATUS_DOT_CLASSES[status])} />
      {USER_STATUS_LABELS[status]}
    </Badge>
  );
}
