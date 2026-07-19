import { BadgeCheck, CircleAlert, Clock3, LogIn, LogOut } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { formatWorkedMinutes } from '@/features/attendance/lib/attendance-status';
import { cn } from '@/lib/utils';
import type { ScanAttendanceActionResult } from '@/server/attendance/types';

type AttendanceScanResultProps =
  | {
      success: true;
      data: ScanAttendanceActionResult;
    }
  | {
      success: false;
      title: string;
      description: string;
    };

export function AttendanceScanResult(props: AttendanceScanResultProps) {
  if (!props.success) {
    return (
      <Card className="card-shadow mx-auto w-full max-w-md border-rose-200/40 shadow-rose-500/5 dark:border-rose-500/20">
        <CardContent className="flex flex-col items-center px-4 py-6 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10">
            <CircleAlert className="h-8 w-8 text-rose-500" strokeWidth={2} />
          </div>

          <span className="mb-3 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-rose-600 uppercase dark:text-rose-400">
            Scan Failed
          </span>

          <h2 className="text-xl font-semibold tracking-tight">{props.title}</h2>

          <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-6">
            {props.description}
          </p>
        </CardContent>
      </Card>
    );
  }

  const { eventType, occurredAt, workedMinutes } = props.data;

  const isClockIn = eventType === 'CLOCK_IN';

  return (
    <Card className="card-shadow mx-auto w-full max-w-md border">
      <CardContent className="flex flex-col items-center px-8 py-10 text-center">
        <div
          className={cn(
            'mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border',
            isClockIn
              ? 'border-emerald-500/20 bg-emerald-500/10'
              : 'border-indigo-500/20 bg-indigo-500/10',
          )}
        >
          {isClockIn ? (
            <LogIn className="h-8 w-8 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
          ) : (
            <LogOut className="h-8 w-8 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
          )}
        </div>

        <span
          className={cn(
            'mb-4 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase',
            isClockIn
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
          )}
        >
          {isClockIn ? 'Clock In Successful' : 'Clock Out Successful'}
        </span>

        <h2 className="text-2xl font-bold tracking-tight">
          {isClockIn ? "You're Checked In" : "You're Checked Out"}
        </h2>

        <div className="mt-5 flex items-center gap-2 text-3xl font-bold" suppressHydrationWarning>
          <Clock3 className="text-muted-foreground h-5 w-5" />
          {occurredAt.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </div>

        <p className="text-muted-foreground mt-2 text-sm" suppressHydrationWarning>
          {occurredAt.toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {!isClockIn && (
          <div className="bg-muted mt-8 flex items-center gap-2 rounded-full px-4 py-2 text-sm">
            <BadgeCheck className="h-4 w-4 text-indigo-500" />

            <span className="text-muted-foreground">Worked</span>

            <span className="font-semibold">{formatWorkedMinutes(workedMinutes)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
