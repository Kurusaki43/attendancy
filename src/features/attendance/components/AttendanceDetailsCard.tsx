'use client';

import { CalendarDays, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AttendanceCompletionPreview } from '@/features/attendance/components/AttendanceCompletionPreview';
import { AttendanceEventsTable } from '@/features/attendance/components/AttendanceEventsTable';
import {
  AttendanceNoEventsYetNotice,
  AttendanceStatusPreview,
} from '@/features/attendance/components/AttendanceStatusPreview';
import { AttendanceUserPreview } from '@/features/attendance/components/AttendanceUserPreview';
import type { AttendanceEmployeeOption } from '@/features/attendance/lib/attendance-employee-option';
import {
  computeFormSummary,
  type CreateAttendanceFormValues,
  type UpdateAttendanceFormValues,
} from '@/features/attendance/lib/attendance-form';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import type { AttendanceResult } from '@/server/attendance/types/action-results';
import { formatDate } from '@/shared/utils/format-date';

type AttendanceDetailsCardProps = {
  control: Control<CreateAttendanceFormValues | UpdateAttendanceFormValues>;
  isPending: boolean;
  footer: ReactNode;
} & (
  | { mode: 'create'; employee: AttendanceEmployeeOption | null; date: Date | undefined }
  | { mode: 'update'; attendance: AttendanceResult }
);

export function AttendanceDetailsCard(props: AttendanceDetailsCardProps) {
  const { control, isPending, footer, mode } = props;
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

  return (
    <Card className="card-shadow flex-1 pb-0">
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-medium tracking-wide">Employee *</Label>
            <AttendanceUserPreview employee={employee} variant="field" />
          </div>

          <div className="space-y-2">
            <Label className="font-medium tracking-wide">Attendance Date *</Label>
            <div className="border-input bg-card flex h-11 items-center gap-2 rounded-md border px-2.5 text-sm shadow-xs">
              <CalendarDays className="text-muted-foreground size-4 shrink-0" />
              {resolvedDate ? (
                <span className="font-medium">
                  {formatDate(resolvedDate, { ...userLocale, dateStyle: 'medium' })}
                </span>
              ) : (
                <span className="text-muted-foreground">No date selected</span>
              )}
            </div>
          </div>
        </div>

        <p className="text-muted-foreground -mt-3 text-xs">
          {isUpdateMode
            ? 'The employee and date cannot be changed on an existing record.'
            : 'The employee and date were set from your selection and cannot be changed here.'}
        </p>

        <div className="border-border/60 grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-medium tracking-wide">Status</Label>
            {hasEvents ? (
              <AttendanceStatusPreview status="PRESENT" />
            ) : mode === 'update' ? (
              <AttendanceStatusPreview status="ABSENT" />
            ) : (
              <AttendanceNoEventsYetNotice
                icon={TriangleAlert}
                title="status will show once events are added."
                subTitle="No Event"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-medium tracking-wide">Completion</Label>
            {summary.completionStatus ? (
              <AttendanceCompletionPreview status={summary.completionStatus} />
            ) : (
              <AttendanceNoEventsYetNotice
                icon={TriangleAlert}
                title=" Completion will show once events are added."
                subTitle="No Event"
              />
            )}
          </div>
        </div>

        <div className="border-border/60 border-t pt-6">
          <AttendanceEventsTable
            control={control}
            isPending={isPending}
            mode={mode}
            originalEvents={isUpdateMode ? (props.attendance.events ?? []) : []}
          />
        </div>
      </CardContent>

      <CardFooter className="border-border/60 my-auto justify-end gap-2 border-t">
        {footer}
      </CardFooter>
    </Card>
  );
}
