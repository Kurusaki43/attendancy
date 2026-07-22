'use client';

import { Calendar, Clock3, Cpu, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceTimeline } from '@/features/attendance/components/AttendanceTimeline';
import { AttendanceUserPreview } from '@/features/attendance/components/AttendanceUserPreview';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import type { AttendanceResult } from '@/server/attendance/types/action-results';
import { DATE_FORMAT, formatDate, TIME_FORMAT } from '@/shared/utils/format-date';

import { formatWorkedMinutes } from '../lib/format-worked-date';

type AttendanceSummaryViewProps = {
  attendance: AttendanceResult;
};

export function AttendanceSummaryView({ attendance }: AttendanceSummaryViewProps) {
  const userLocale = useUserLocale();

  const employee = {
    firstName: attendance.employee.user.firstName,
    lastName: attendance.employee.user.lastName,
    avatar: attendance.employee.user.avatar,
    employeeCode: attendance.employee.employeeCode,
    position: attendance.employee.position?.title ?? null,
    department: attendance.employee.department?.name ?? null,
  };

  const timelineEvents = [...(attendance.events ?? [])]
    .map((event) => ({
      type: event.type,
      occurredAt: event.occurredAt,
      reason: event.reason ?? undefined,
    }))
    .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());

  return (
    <Card className="card-shadow flex-1">
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="space-y-1.5">
          <p className="text-muted-foreground text-xs font-medium tracking-wide">Employee</p>
          <AttendanceUserPreview employee={employee} variant="plain" />
        </div>

        <div className="space-y-1.5">
          <p className="text-muted-foreground text-xs font-medium tracking-wide">Date</p>
          <p className="flex items-center gap-1.5 text-sm">
            <Calendar className="text-muted-foreground size-4 shrink-0" />
            <span className="text-foreground font-medium">
              {formatDate(attendance.date, { ...userLocale, ...DATE_FORMAT })} (
              <span className="text-muted-foreground capitalize">
                {formatDate(attendance.date, { ...userLocale, weekday: 'long' })})
              </span>
            </span>
          </p>
        </div>

        <div className="border-border/60 space-y-3 border-t pt-4">
          <p className="text-muted-foreground text-xs font-medium tracking-wide">
            Events ({timelineEvents.length})
          </p>
          <AttendanceTimeline events={timelineEvents} />
        </div>

        <div className="border-border/60 space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-medium tracking-wide">
              First Clock In
            </p>
            <p className="text-muted-foreground font-mono text-sm">
              {attendance.firstClockIn
                ? formatDate(attendance.firstClockIn, { ...userLocale, ...TIME_FORMAT })
                : '—'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-medium tracking-wide">
              Last Clock Out
            </p>
            <p className="text-muted-foreground font-mono text-sm">
              {attendance.lastClockOut
                ? formatDate(attendance.lastClockOut, { ...userLocale, ...TIME_FORMAT })
                : '—'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-medium tracking-wide">
              Worked Duration
            </p>
            <p className="text-muted-foreground flex items-center gap-1.5 font-mono text-sm">
              <Clock3 className="size-4" />
              {formatWorkedMinutes(attendance.workedMinutes)}
            </p>
          </div>
        </div>

        <div className="border-border/60 flex items-center justify-between border-t pt-4">
          <p className="text-muted-foreground text-xs font-medium tracking-wide">Source</p>
          {attendance.hasManualChanges ? (
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
      </CardContent>
    </Card>
  );
}
