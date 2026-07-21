'use client';

import { LogIn, LogOut, Plus, Trash2 } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { useFieldArray, useFormState, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AttendanceSectionNumber } from '@/features/attendance/components/AttendanceSectionNumber';
import {
  computeFormSummary,
  type CreateAttendanceFormValues,
  type UpdateAttendanceFormValues,
} from '@/features/attendance/lib/attendance-form';
import { formatWorkedMinutes } from '@/features/attendance/lib/attendance-status';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import { formatDate, TIME_FORMAT } from '@/shared/utils/format-date';

type AttendanceEventsSectionProps = {
  control: Control<CreateAttendanceFormValues | UpdateAttendanceFormValues>;
  isPending: boolean;
  date: Date | undefined;
  mode: 'create' | 'update';
};

export function AttendanceEventsSection({
  control,
  isPending,
  date,
  mode,
}: AttendanceEventsSectionProps) {
  const userLocale = useUserLocale();

  const events = useWatch({ control, name: 'events' });
  const { fields, append, remove } = useFieldArray({ control, name: 'events' });
  const { errors } = useFormState({ control });
  const eventsError = errors.events?.message as string | undefined;

  const summary = computeFormSummary(date, events ?? []);

  const handleAddEvent = () => {
    const lastType = fields.length > 0 ? fields[fields.length - 1].type : undefined;
    append({ type: lastType === 'CLOCK_IN' ? 'CLOCK_OUT' : 'CLOCK_IN', time: '', reason: '' });
  };

  return (
    <Card className="card-shadow">
      <CardHeader className="flex items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <AttendanceSectionNumber n={3} />
          <CardTitle>Attendance Events</CardTitle>
        </div>
        <Button type="button" size="sm" onClick={handleAddEvent} disabled={isPending}>
          <Plus data-icon="inline-start" />
          <span className="hidden sm:block"> Add Event</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-xs">
          Add all clock in and clock out events for this day.
        </p>

        {eventsError && <p className="text-destructive text-sm">{eventsError}</p>}

        {mode === 'update' && fields.length === 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Removing all events will mark this attendance as Absent when you save.
          </p>
        )}

        {fields.length > 0 && (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead className="min-w-32">Type</TableHead>
                  <TableHead className="min-w-32">Time *</TableHead>
                  <TableHead className="min-w-48">Notes</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`events.${index}.type`}
                        render={({ field: typeField }) => (
                          <Select
                            value={typeField.value}
                            onValueChange={typeField.onChange}
                            disabled={isPending}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue>
                                {(selected: string) =>
                                  selected === 'CLOCK_IN' ? (
                                    <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                                      <LogIn className="size-3.5" />
                                      Clock In
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                                      <LogOut className="size-3.5" />
                                      Clock Out
                                    </span>
                                  )
                                }
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CLOCK_IN">Clock In</SelectItem>
                              <SelectItem value="CLOCK_OUT">Clock Out</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`events.${index}.time`}
                        render={({ field: timeField }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="time"
                                {...timeField}
                                disabled={isPending}
                                className="min-w-32 text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`events.${index}.reason`}
                        render={({ field: reasonField }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="e.g. Start of day"
                                {...reasonField}
                                disabled={isPending}
                                className="text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={isPending}
                        onClick={() => remove(index)}
                        aria-label="Remove event"
                      >
                        <Trash2 className="text-destructive size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="bg-muted/50 grid grid-cols-2 gap-4 rounded-md border p-3 text-sm sm:grid-cols-4">
          <div>
            <p className="text-muted-foreground text-xs">Events Added</p>
            <p className="text-primary font-semibold">{fields.length} events</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">First Clock In</p>
            <p className="font-semibold">
              {summary.firstClockIn
                ? formatDate(summary.firstClockIn, { ...userLocale, ...TIME_FORMAT })
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Last Clock Out</p>
            <p className="font-semibold">
              {summary.lastClockOut
                ? formatDate(summary.lastClockOut, { ...userLocale, ...TIME_FORMAT })
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Net Working Time (Auto)</p>
            <p className="text-primary font-semibold">
              {formatWorkedMinutes(summary.workedMinutes)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
