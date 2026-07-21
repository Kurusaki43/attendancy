'use client';

import { CheckCircle2 } from 'lucide-react';
import type { Control } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AttendanceSectionNumber } from '@/features/attendance/components/AttendanceSectionNumber';
import type { UpdateAttendanceFormValues } from '@/features/attendance/lib/attendance-form';
import {
  ATTENDANCE_STATUS_DOT_CLASSES,
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_PANEL_CLASSES,
  ATTENDANCE_STATUSES,
} from '@/features/attendance/lib/attendance-status';
import { cn } from '@/lib/utils';

type AttendanceAdditionalInfoSectionProps =
  | { mode: 'create'; control?: never; isPending: boolean }
  | { mode: 'update'; control: Control<UpdateAttendanceFormValues>; isPending: boolean };

export function AttendanceAdditionalInfoSection({
  mode,
  control,
  isPending,
}: AttendanceAdditionalInfoSectionProps) {
  return (
    <Card className="card-shadow">
      <CardHeader className="flex items-center gap-2 space-y-0">
        <AttendanceSectionNumber n={2} />
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {mode === 'update' ? (
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium tracking-wide">Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(selected: string) => (
                          <span className="flex items-center gap-2">
                            <span
                              className={cn(
                                'size-1.5 shrink-0 rounded-full',
                                ATTENDANCE_STATUS_DOT_CLASSES[
                                  selected as keyof typeof ATTENDANCE_STATUS_DOT_CLASSES
                                ],
                              )}
                            />
                            {
                              ATTENDANCE_STATUS_LABELS[
                                selected as keyof typeof ATTENDANCE_STATUS_LABELS
                              ]
                            }
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ATTENDANCE_STATUSES.map((statusOption) => (
                      <SelectItem key={statusOption} value={statusOption}>
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              'size-1.5 shrink-0 rounded-full',
                              ATTENDANCE_STATUS_DOT_CLASSES[statusOption],
                            )}
                          />
                          {ATTENDANCE_STATUS_LABELS[statusOption]}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div className="space-y-2">
            <Label className="pb-2 font-medium tracking-wide">Status</Label>
            <MarkedAsPresent />
          </div>
        )}

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
