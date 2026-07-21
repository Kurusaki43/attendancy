'use client';

import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AttendanceSectionNumber } from '@/features/attendance/components/AttendanceSectionNumber';
import type {
  CreateAttendanceFormValues,
  UpdateAttendanceFormValues,
} from '@/features/attendance/lib/attendance-form';
import {
  ATTENDANCE_STATUS_DOT_CLASSES,
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_PANEL_CLASSES,
} from '@/features/attendance/lib/attendance-status';
import { cn } from '@/lib/utils';

type AttendanceAdditionalInfoSectionProps = {
  mode: 'create' | 'update';
  control: Control<CreateAttendanceFormValues | UpdateAttendanceFormValues>;
};

export function AttendanceAdditionalInfoSection({
  mode,
  control,
}: AttendanceAdditionalInfoSectionProps) {
  const events = useWatch({ control, name: 'events' }) ?? [];
  const hasEvents = events.length > 0;

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
            <MarkedAsPresent />
          ) : mode === 'update' ? (
            <WillBeDeletedNotice />
          ) : (
            <NoEventsYetNotice />
          )}
        </div>

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

const MarkedAsPresent = () => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md border p-3',
        ATTENDANCE_STATUS_PANEL_CLASSES.PRESENT,
      )}
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full text-white',
          ATTENDANCE_STATUS_DOT_CLASSES.PRESENT,
        )}
      >
        <CheckCircle2 className="size-5" />
      </span>
      <div>
        <p className="text-muted-foreground text-xs">This attendance will be marked as:</p>
        <p className="text-sm font-semibold">{ATTENDANCE_STATUS_LABELS['PRESENT']}</p>
      </div>
    </div>
  );
};

const WillBeDeletedNotice = () => {
  return (
    <div className="flex items-center gap-3 rounded-md border border-amber-500/20 bg-amber-500/10 p-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
        <AlertTriangle className="size-5" />
      </span>
      <div>
        <p className="text-muted-foreground text-xs">No events remain on this record.</p>
        <p className="text-sm font-semibold">Saving will delete this attendance record.</p>
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
