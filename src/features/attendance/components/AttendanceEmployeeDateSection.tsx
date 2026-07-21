'use client';

import { Info } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AttendanceSectionNumber } from '@/features/attendance/components/AttendanceSectionNumber';
import type { AttendanceEmployeeOption } from '@/features/attendance/lib/attendance-employee-option';
import { UserAvatar } from '@/features/dashboard/components/UserAvatar';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import type { AttendanceResult } from '@/server/attendance/types/action-results';
import { formatDate } from '@/shared/utils/format-date';

type AttendanceEmployeeDateSectionProps =
  | { mode: 'create'; employee: AttendanceEmployeeOption | null; date: Date | undefined }
  | { mode: 'update'; attendance: AttendanceResult };

export function AttendanceEmployeeDateSection(props: AttendanceEmployeeDateSectionProps) {
  const userLocale = useUserLocale();
  const isUpdateMode = props.mode === 'update';

  const resolvedDate = isUpdateMode ? props.attendance.date : props.date;

  const employee = isUpdateMode
    ? {
        firstName: props.attendance.employee.user.firstName,
        lastName: props.attendance.employee.user.lastName,
        avatar: props.attendance.employee.user.avatar,
        employeeCode: props.attendance.employee.employeeCode,
        position: props.attendance.employee.position?.title ?? null,
        department: props.attendance.employee.department?.name ?? null,
      }
    : props.employee;

  return (
    <Card className="card-shadow">
      <CardHeader className="flex items-center gap-2 space-y-0">
        <AttendanceSectionNumber n={1} />
        <CardTitle>Employee &amp; Date</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="space-y-2">
          <Label className="font-medium tracking-wide">Employee</Label>
          <div className="bg-muted/40 flex items-center gap-3 rounded-md border p-2">
            {employee ? (
              <>
                <UserAvatar
                  firstName={employee.firstName}
                  lastName={employee.lastName}
                  avatar={employee.avatar}
                  size="sm"
                  className="shrink-0"
                />
                <div className="min-w-0">
                  <p className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">
                      {employee.firstName} {employee.lastName}
                    </span>
                    <Badge variant="secondary" className="shrink-0">
                      {employee.employeeCode}
                    </Badge>
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {[employee.position, employee.department].filter(Boolean).join(' • ')}
                  </p>
                </div>
              </>
            ) : (
              <span className="text-muted-foreground text-sm">No employee selected</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium tracking-wide">Attendance Date</Label>
          <div className="bg-muted/40 rounded-md border p-2">
            {resolvedDate ? (
              <span className="text-sm font-medium">
                {formatDate(resolvedDate, { ...userLocale, dateStyle: 'medium' })}
              </span>
            ) : (
              <span className="text-muted-foreground text-sm">No date selected</span>
            )}
          </div>
        </div>

        <div className="bg-primary/5 border-primary/20 flex items-start gap-4 rounded-md border p-2.5 text-xs sm:col-span-2 xl:col-span-1">
          <Info className="text-primary mt-0.5 size-4 shrink-0" />
          <div className="text-muted-foreground">
            {isUpdateMode ? (
              <p>
                You are editing a manually-entered attendance record. The employee and date cannot
                be changed.
              </p>
            ) : (
              <span className="space-y-2">
                <p className="text-foreground font-medium">You are adding attendance manually .</p>
                <p>
                  The employee and date were set from your selection and cannot be changed here.
                </p>
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
