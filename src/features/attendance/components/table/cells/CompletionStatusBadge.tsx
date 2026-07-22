import { Badge } from '@/components/ui/badge';
import {
  ATTENDANCE_COMPLETION_STATUS_BADGE_CLASSES,
  ATTENDANCE_COMPLETION_STATUS_DOT_CLASSES,
  ATTENDANCE_COMPLETION_STATUS_LABELS,
} from '@/features/attendance/lib/attendance-status';
import { cn } from '@/lib/utils';
import type { AttendanceResult } from '@/server/attendance/types';

export function CompletionStatusBadge({
  completionStatus,
}: {
  completionStatus: AttendanceResult['completionStatus'];
}) {
  if (!completionStatus) {
    return <span className="text-muted-foreground italic opacity-50">—</span>;
  }

  return (
    <Badge
      className={cn('rounded-sm', ATTENDANCE_COMPLETION_STATUS_BADGE_CLASSES[completionStatus])}
    >
      <span
        className={cn(
          'size-1.5 shrink-0 rounded-full',
          ATTENDANCE_COMPLETION_STATUS_DOT_CLASSES[completionStatus],
        )}
      />
      {ATTENDANCE_COMPLETION_STATUS_LABELS[completionStatus]}
    </Badge>
  );
}
