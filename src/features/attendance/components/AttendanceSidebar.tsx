'use client';

import { Clock2Icon, Info, LogIn, LogOut } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  combineDateAndTime,
  type CreateAttendanceFormValues,
  type UpdateAttendanceFormValues,
} from '@/features/attendance/lib/attendance-form';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import { cn } from '@/lib/utils';
import { formatDate, TIME_FORMAT } from '@/shared/utils/format-date';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

type AttendanceSidebarProps = {
  control: Control<CreateAttendanceFormValues | UpdateAttendanceFormValues>;
  date: Date | undefined;
};

export function AttendanceSidebar({ control, date }: AttendanceSidebarProps) {
  const userLocale = useUserLocale();
  const events = useWatch({ control, name: 'events' }) ?? [];

  const timelineEvents = date
    ? [...events]
        .filter((event) => TIME_REGEX.test(event.time))
        .map((event) => ({ ...event, occurredAt: combineDateAndTime(date, event.time) }))
        .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())
    : [];

  return (
    <div className="flex flex-col gap-4 sm:flex-row lg:flex-col [&>*]:flex-1">
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Timeline Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {timelineEvents.length === 0 ? (
            <p className="text-muted-foreground flex items-start justify-center gap-2 text-center text-sm">
              <Clock2Icon size={16} />
              No attendance events added yet.
            </p>
          ) : (
            <ol>
              {timelineEvents.map((event, index) => {
                const isClockIn = event.type === 'CLOCK_IN';
                const isLast = index === timelineEvents.length - 1;

                return (
                  <li key={`${event.type}-${event.time}-${index}`} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          'flex size-7 shrink-0 items-center justify-center rounded-full',
                          isClockIn
                            ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                            : 'bg-red-500/15 text-red-600 dark:text-red-400',
                        )}
                      >
                        {isClockIn ? (
                          <LogIn className="size-3.5" />
                        ) : (
                          <LogOut className="size-3.5" />
                        )}
                      </span>
                      {!isLast && <span className="bg-border w-px flex-1" />}
                    </div>
                    <div className={cn('min-w-0 flex-1', !isLast && 'pb-5')}>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">
                          {isClockIn ? 'Clock In' : 'Clock Out'}
                        </p>
                        <span className="border-border ml-auto hidden h-px w-12 border xl:block" />
                        {event.reason && (
                          <Badge
                            variant="secondary"
                            className="inline max-w-32 truncate text-xs font-light"
                          >
                            {event.reason}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {formatDate(event.occurredAt, { ...userLocale, ...TIME_FORMAT })}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>

      <div className="bg-primary/5 border-primary/20 flex items-start gap-3 rounded-md border p-3 text-xs">
        <Info className="text-primary mt-0.5 size-4 shrink-0" />
        <div className="text-muted-foreground space-y-1.5">
          <p className="text-foreground font-medium">About Manual Attendance</p>
          <p>
            Use manual attendance only when necessary (e.g. missed clock in/out, system issues).
          </p>
          <p>All manual records are logged and can be reviewed later.</p>
        </div>
      </div>
    </div>
  );
}
