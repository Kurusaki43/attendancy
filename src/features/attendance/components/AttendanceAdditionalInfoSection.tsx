'use client';

import { CheckCircle2, Clock3, XCircle } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AttendanceSectionNumber } from '@/features/attendance/components/AttendanceSectionNumber';
import {
  computeFormSummary,
  type CreateAttendanceFormValues,
  type UpdateAttendanceFormValues,
} from '@/features/attendance/lib/attendance-form';
import {
  ATTENDANCE_COMPLETION_STATUS_DOT_CLASSES,
  ATTENDANCE_COMPLETION_STATUS_LABELS,
  ATTENDANCE_COMPLETION_STATUS_PANEL_CLASSES,
  ATTENDANCE_STATUS_DOT_CLASSES,
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_PANEL_CLASSES,
  type AttendanceCompletionStatus,
} from '@/features/attendance/lib/attendance-status';
import { cn } from '@/lib/utils';

type AttendanceAdditionalInfoSectionProps = {
  mode: 'create' | 'update';
  control: Control<CreateAttendanceFormValues | UpdateAttendanceFormValues>;
  date: Date | undefined;
};

export function AttendanceAdditionalInfoSection({
  mode,
  control,
  date,
}: AttendanceAdditionalInfoSectionProps) {
  const events = useWatch({ control, name: 'events' }) ?? [];
  const hasEvents = events.length > 0;
  const summary = computeFormSummary(date, events);

  return (
    <Card className="card-shadow">
      <CardHeader className="flex items-center gap-2 space-y-0">
        <AttendanceSectionNumber n={2} />
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="space-y-2">
          <Label className="pb-2 font-medium tracking-wide">Status</Label>
          {hasEvents ? (
            <StatusPreview status="PRESENT" />
          ) : mode === 'update' ? (
            <StatusPreview status="ABSENT" />
          ) : (
            <NoEventsYetNotice />
          )}
        </div>

        {hasEvents && summary.completionStatus && (
          <div className="space-y-2">
            <Label className="pb-2 font-medium tracking-wide">Completion</Label>
            <CompletionPreview status={summary.completionStatus} />
          </div>
        )}

        <div className="space-y-2">
          <Label className="pb-2 font-medium tracking-wide">Method</Label>
          <div className="rounded-sm border p-2">
            <Badge variant="default" className="rounded-sm">
              Manual
            </Badge>
            <p className="text-muted-foreground mt-2 text-xs">
              Attendance added manually by an administrator.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type PreviewStatus = 'PRESENT' | 'ABSENT';

const STATUS_PREVIEW_ICONS: Record<PreviewStatus, typeof CheckCircle2> = {
  PRESENT: CheckCircle2,
  ABSENT: XCircle,
};

const StatusPreview = ({ status }: { status: PreviewStatus }) => {
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
      <div>
        <p className="text-muted-foreground text-xs">This attendance will be marked as:</p>
        <p className="text-sm font-semibold">{ATTENDANCE_STATUS_LABELS[status]}</p>
      </div>
    </div>
  );
};

const COMPLETION_PREVIEW_ICONS: Record<AttendanceCompletionStatus, typeof CheckCircle2> = {
  COMPLETE: CheckCircle2,
  INCOMPLETE: Clock3,
};

const CompletionPreview = ({ status }: { status: AttendanceCompletionStatus }) => {
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
};

const NoEventsYetNotice = () => {
  return (
    <div className="text-muted-foreground rounded-md border border-dashed p-3 text-sm">
      Add at least one clock in/out event to mark this attendance as Present.
    </div>
  );
};
