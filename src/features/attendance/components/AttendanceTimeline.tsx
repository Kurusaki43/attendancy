import { LogIn, LogOut } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import { cn } from '@/lib/utils';
import { formatDate, TIME_FORMAT } from '@/shared/utils/format-date';

export type AttendanceTimelineEvent = {
  type: 'CLOCK_IN' | 'CLOCK_OUT';
  occurredAt: Date;
  reason?: string;
};

type AttendanceTimelineProps = {
  events: AttendanceTimelineEvent[];
};

/** Chronological timeline of clock-in/out events for the Attendance Summary sidebar. */
export function AttendanceTimeline({ events }: AttendanceTimelineProps) {
  const userLocale = useUserLocale();

  if (events.length === 0) {
    return <p className="text-muted-foreground text-xs">No attendance events added yet.</p>;
  }

  return (
    <ol>
      {events.map((event, index) => {
        const isClockIn = event.type === 'CLOCK_IN';
        const isLast = index === events.length - 1;

        return (
          <li key={`${event.type}-${index}`} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full',
                  isClockIn
                    ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                    : 'bg-red-500/15 text-red-600 dark:text-red-400',
                )}
              >
                {isClockIn ? <LogIn className="size-3" /> : <LogOut className="size-3" />}
              </span>
              {!isLast && <span className="bg-border w-px flex-1" />}
            </div>
            <div className={cn('min-w-0 flex-1', !isLast && 'pb-5')}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium">{isClockIn ? 'Clock In' : 'Clock Out'}</p>

                {event.reason && (
                  <Badge
                    variant="secondary"
                    className="inline max-w-32 truncate text-xs font-light"
                  >
                    {event.reason}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground font-mono text-xs">
                {formatDate(event.occurredAt, { ...userLocale, ...TIME_FORMAT })}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
