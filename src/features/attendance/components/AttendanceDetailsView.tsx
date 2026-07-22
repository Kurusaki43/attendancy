'use client';

import { CalendarDays, TriangleAlert } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AttendanceCompletionPreview } from '@/features/attendance/components/AttendanceCompletionPreview';
import { AttendanceEventsView } from '@/features/attendance/components/AttendanceEventsView';
import {
  AttendanceNoEventsYetNotice,
  AttendanceStatusPreview,
} from '@/features/attendance/components/AttendanceStatusPreview';
import { AttendanceUserPreview } from '@/features/attendance/components/AttendanceUserPreview';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import type { AttendanceResult } from '@/server/attendance/types/action-results';
import { formatDate } from '@/shared/utils/format-date';

type AttendanceDetailsViewProps = {
  attendance: AttendanceResult;
};

export function AttendanceDetailsView({ attendance }: AttendanceDetailsViewProps) {
  const userLocale = useUserLocale();

  const employee = {
    firstName: attendance.employee.user.firstName,
    lastName: attendance.employee.user.lastName,
    avatar: attendance.employee.user.avatar,
    employeeCode: attendance.employee.employeeCode,
    position: attendance.employee.position?.title ?? null,
    department: attendance.employee.department?.name ?? null,
  };

  return (
    <Card className="card-shadow flex-1">
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-medium tracking-wide">Employee</Label>
            <AttendanceUserPreview employee={employee} variant="plain" />
          </div>

          <div className="space-y-2">
            <Label className="font-medium tracking-wide">Attendance Date</Label>
            <p className="flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="text-muted-foreground size-4 shrink-0" />
              {formatDate(attendance.date, { ...userLocale, dateStyle: 'medium' })}
            </p>
          </div>
        </div>

        <div className="border-border/60 grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-medium tracking-wide">Status</Label>
            <AttendanceStatusPreview status={attendance.status} caption="Recorded status:" />
          </div>

          <div className="space-y-2">
            <Label className="font-medium tracking-wide">Completion</Label>
            {attendance.completionStatus ? (
              <AttendanceCompletionPreview
                status={attendance.completionStatus}
                caption={
                  attendance.completionStatus === 'COMPLETE'
                    ? 'Every clock in has a matching clock out.'
                    : 'A clock in has no matching clock out.'
                }
              />
            ) : (
              <AttendanceNoEventsYetNotice
                icon={TriangleAlert}
                title="Not applicable for absent attendance."
                subTitle="No Applicable"
              />
            )}
          </div>
        </div>

        <div className="border-border/60 border-t pt-6">
          <AttendanceEventsView events={attendance.events ?? []} />
        </div>
      </CardContent>
    </Card>
  );
}
