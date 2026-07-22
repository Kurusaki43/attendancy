import { Badge } from '@/components/ui/badge';
import {
  ATTENDANCE_STATUS_BADGE_CLASSES,
  ATTENDANCE_STATUS_DOT_CLASSES,
  ATTENDANCE_STATUS_LABELS,
} from '@/features/attendance/lib/attendance-status';
import { cn } from '@/lib/utils';
import type { AttendanceResult } from '@/server/attendance/types';

export function AttendanceStatusBadge({ status }: { status: AttendanceResult['status'] }) {
  return (
    <Badge className={cn('rounded-sm', ATTENDANCE_STATUS_BADGE_CLASSES[status])}>
      <span
        className={cn('size-1.5 shrink-0 rounded-full', ATTENDANCE_STATUS_DOT_CLASSES[status])}
      />
      {ATTENDANCE_STATUS_LABELS[status]}
    </Badge>
  );
}
