import { CheckCircle2, Clock3 } from 'lucide-react';

import {
  ATTENDANCE_COMPLETION_STATUS_DOT_CLASSES,
  ATTENDANCE_COMPLETION_STATUS_LABELS,
  ATTENDANCE_COMPLETION_STATUS_PANEL_CLASSES,
  type AttendanceCompletionStatus,
} from '@/features/attendance/lib/attendance-status';
import { cn } from '@/lib/utils';

const COMPLETION_PREVIEW_ICONS: Record<AttendanceCompletionStatus, typeof CheckCircle2> = {
  COMPLETE: CheckCircle2,
  INCOMPLETE: Clock3,
};

type AttendanceCompletionPreviewProps = {
  status: AttendanceCompletionStatus;
};

/** Read-only preview of the auto-computed completion status — derived from events, not
 * user-selectable. */
export function AttendanceCompletionPreview({ status }: AttendanceCompletionPreviewProps) {
  const Icon = COMPLETION_PREVIEW_ICONS[status];

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md border p-3',
        ATTENDANCE_COMPLETION_STATUS_PANEL_CLASSES[status],
      )}
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full text-white',
          ATTENDANCE_COMPLETION_STATUS_DOT_CLASSES[status],
        )}
      >
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-muted-foreground text-xs">
          {status === 'INCOMPLETE'
            ? 'Missing a Clock Out — this will need HR follow-up.'
            : 'Every clock in has a matching clock out.'}
        </p>
        <p className="text-sm font-semibold">{ATTENDANCE_COMPLETION_STATUS_LABELS[status]}</p>
      </div>
    </div>
  );
}
