'use client';

import { Calendar, Clock3, Cpu, Info, User } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceTimeline } from '@/features/attendance/components/AttendanceTimeline';
import { AttendanceUserPreview } from '@/features/attendance/components/AttendanceUserPreview';
import type { AttendanceEmployeeOption } from '@/features/attendance/lib/attendance-employee-option';
import {
  combineDateAndTime,
  computeFormSummary,
  type CreateAttendanceFormValues,
  haveAttendanceEventsChanged,
  type UpdateAttendanceFormValues,
} from '@/features/attendance/lib/attendance-form';
import {
  ATTENDANCE_COMPLETION_STATUS_BADGE_CLASSES,
  ATTENDANCE_COMPLETION_STATUS_LABELS,
} from '@/features/attendance/lib/attendance-status';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import { cn } from '@/lib/utils';
import type { AttendanceResult } from '@/server/attendance/types/action-results';
import { DATE_FORMAT, formatDate } from '@/shared/utils/format-date';

import { formatWorkedMinutes } from '../lib/format-worked-date';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

type AttendanceSidebarProps = {
  control: Control<CreateAttendanceFormValues | UpdateAttendanceFormValues>;
} & (
  | { mode: 'create'; employee: AttendanceEmployeeOption | null; date: Date | undefined }
  | { mode: 'update'; attendance: AttendanceResult }
);

export function AttendanceSidebar(props: AttendanceSidebarProps) {
  const { control, mode } = props;
  const userLocale = useUserLocale();
  const isUpdateMode = mode === 'update';

  const resolvedDate = isUpdateMode ? props.attendance.date : props.date;
  const employee = isUpdateMode
    ? {
        firstName: props.attendance.employee.user.firstName,
        lastName: props.attendance.employee.user.lastName,
        avatar: props.attendance.employee.user.avatar,
        employeeCode: props.attendance.employee.employeeCode,
      }
    : props.employee;

  const events = useWatch({ control, name: 'events' }) ?? [];
  const hasEvents = events.length > 0;
  const summary = computeFormSummary(resolvedDate, events);

  const isManualSource = isUpdateMode
    ? haveAttendanceEventsChanged(props.attendance.events ?? [], events) ||
      props.attendance.hasManualChanges
    : true;

  const timelineEvents = resolvedDate
    ? [...events]
        .filter((event) => TIME_REGEX.test(event.time))
        .map((event) => ({
          type: event.type,
          occurredAt: combineDateAndTime(resolvedDate, event.time),
          reason: event.reason,
        }))
        .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())
    : [];

  return (
    <Card className="card-shadow flex-1">
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="space-y-1.5">
          <p className="text-xs font-medium tracking-wide">Employee</p>
          <AttendanceUserPreview employee={employee} variant="plain" />
        </div>

        <div className="space-y-1.5">
          <p className="text-muted-foreground text-xs font-medium tracking-wide">Date</p>
          <p className="flex items-center gap-1.5 text-sm">
            <Calendar className="text-muted-foreground size-4 shrink-0" />
            {resolvedDate ? (
              <span className="text-foreground font-medium">
                {formatDate(resolvedDate, { ...userLocale, ...DATE_FORMAT })} (
                <span className="text-muted-foreground capitalize">
                  {formatDate(resolvedDate, { ...userLocale, weekday: 'long' })})
                </span>
              </span>
            ) : (
              'No date selected'
            )}
          </p>
        </div>

        <div className="border-border/60 space-y-1.5 border-t pt-4">
          <p className="text-muted-foreground text-xs font-medium tracking-wide">
            Completion Status
          </p>
          {summary.completionStatus ? (
            <>
              <Badge
                className={cn(
                  'rounded-sm',
                  ATTENDANCE_COMPLETION_STATUS_BADGE_CLASSES[summary.completionStatus],
                )}
              >
                {ATTENDANCE_COMPLETION_STATUS_LABELS[summary.completionStatus]}
              </Badge>
              <p className="text-muted-foreground text-xs">
                {summary.completionStatus === 'COMPLETE'
                  ? 'All events are complete.'
                  : 'Missing a clock-out — this will need HR follow-up.'}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground text-xs">No events added yet.</p>
          )}
        </div>

        <div className="border-border/60 space-y-3 border-t pt-4">
          <p className="text-muted-foreground text-xs font-medium tracking-wide">
            Events ({events.length})
          </p>
          <AttendanceTimeline events={timelineEvents} />
        </div>

        <div className="border-border/60 flex items-center justify-between border-t pt-4">
          <p className="text-muted-foreground text-xs font-medium tracking-wide">Worked Duration</p>
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <Clock3 className="text-muted-foreground size-4" />
            {formatWorkedMinutes(summary.workedMinutes)}
          </p>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-muted-foreground text-xs font-medium tracking-wide">Source</p>
          {isManualSource ? (
            <Badge className="rounded-sm bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
              <User className="size-3" />
              Manual
            </Badge>
          ) : (
            <Badge className="rounded-sm bg-slate-500/15 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400">
              <Cpu className="size-3" />
              Automatic
            </Badge>
          )}
        </div>

        <div className="bg-primary/5 border-border/60 flex items-start gap-2.5 rounded-md border p-3 text-xs">
          <Info className="text-primary mt-0.5 size-4 shrink-0" />
          <p className="text-muted-foreground text-xs">
            {hasEvents ? (
              <>
                The attendance will be marked as{' '}
                <span className="text-primary font-semibold">Present</span> after saving.
              </>
            ) : isUpdateMode ? (
              <>
                The attendance will be marked as{' '}
                <span className="text-primary font-semibold">Absent</span> after saving.
              </>
            ) : (
              'Add at least one clock in/out event to mark this attendance as Present.'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
