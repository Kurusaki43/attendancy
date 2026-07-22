'use client';

import { LogIn, LogOut } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AttendanceMethodBadge } from '@/features/attendance/components/AttendanceMethodBadge';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import { cn } from '@/lib/utils';
import type { AttendanceEventResult } from '@/server/attendance/types/action-results';
import { formatDate, TIME_FORMAT } from '@/shared/utils/format-date';

type AttendanceEventsViewProps = {
  events: AttendanceEventResult[];
};

export function AttendanceEventsView({ events }: AttendanceEventsViewProps) {
  const userLocale = useUserLocale();
  const sortedEvents = [...events].sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Attendance Events</h3>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead className="min-w-32">Type</TableHead>
              <TableHead className="min-w-32">Time</TableHead>
              <TableHead className="min-w-32">Method</TableHead>
              <TableHead className="min-w-48">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground p-4 text-center text-xs">
                  No events recorded
                </TableCell>
              </TableRow>
            ) : (
              sortedEvents.map((event, index) => {
                const isClockIn = event.type === 'CLOCK_IN';

                return (
                  <TableRow key={event.id}>
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'rounded-sm',
                          isClockIn
                            ? 'bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                            : 'bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-400',
                        )}
                      >
                        {isClockIn ? <LogIn className="size-3" /> : <LogOut className="size-3" />}
                        {isClockIn ? 'Clock In' : 'Clock Out'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatDate(event.occurredAt, { ...userLocale, ...TIME_FORMAT })}
                    </TableCell>
                    <TableCell>
                      <AttendanceMethodBadge method={event.method} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {event.reason || '—'}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
