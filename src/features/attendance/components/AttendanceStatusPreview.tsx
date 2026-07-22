import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, XCircle } from 'lucide-react';

import {
  ATTENDANCE_STATUS_DOT_CLASSES,
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_PANEL_CLASSES,
} from '@/features/attendance/lib/attendance-status';
import { cn } from '@/lib/utils';

type PreviewStatus = 'PRESENT' | 'ABSENT';

const STATUS_PREVIEW_ICONS: Record<PreviewStatus, typeof CheckCircle2> = {
  PRESENT: CheckCircle2,
  ABSENT: XCircle,
};

type AttendanceStatusPreviewProps = {
  status: PreviewStatus;
};

export function AttendanceStatusPreview({ status }: AttendanceStatusPreviewProps) {
  const Icon = STATUS_PREVIEW_ICONS[status];

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md border p-3',
        ATTENDANCE_STATUS_PANEL_CLASSES[status],
      )}
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full text-white',
          ATTENDANCE_STATUS_DOT_CLASSES[status],
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="space-y-0.5">
        <p className="text-muted-foreground text-xs">This attendance will be marked as:</p>
        <p className="text-sm font-semibold">{ATTENDANCE_STATUS_LABELS[status]}</p>
      </div>
    </div>
  );
}

export function AttendanceNoEventsYetNotice({
  icon,
  title,
  subTitle,
}: {
  icon: LucideIcon;
  title: string;
  subTitle: string;
}) {
  const Icon = icon;
  return (
    <div className={cn('flex items-center gap-3 rounded-md border p-3')}>
      <span
        className={cn('flex size-8 shrink-0 items-center justify-center rounded-full text-white')}
      >
        <Icon className="text-primary size-5" />
      </span>
      <div className="space-y-0.5">
        <p className="text-muted-foreground text-xs">{title}</p>
        <p className="text-sm font-semibold">{subTitle}</p>
      </div>
    </div>
  );
}
