import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, Palmtree, PartyPopper, XCircle } from 'lucide-react';

import type { AttendanceStatus } from '@/features/attendance/lib/attendance-status';
import {
  ATTENDANCE_STATUS_DOT_CLASSES,
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_PANEL_CLASSES,
} from '@/features/attendance/lib/attendance-status';
import { cn } from '@/lib/utils';

const STATUS_PREVIEW_ICONS: Record<AttendanceStatus, LucideIcon> = {
  PRESENT: CheckCircle2,
  ABSENT: XCircle,
  ON_LEAVE: Palmtree,
  HOLIDAY: PartyPopper,
};

type AttendanceStatusPreviewProps = {
  status: AttendanceStatus;
  caption?: string;
};

export function AttendanceStatusPreview({
  status,
  caption = 'This attendance will be marked as:',
}: AttendanceStatusPreviewProps) {
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
        <p className="text-muted-foreground text-xs">{caption}</p>
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
