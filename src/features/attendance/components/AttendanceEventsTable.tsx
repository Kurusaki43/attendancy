'use client';

import { Info, LogIn, LogOut, Plus, Trash2 } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { useFieldArray, useFormState } from 'react-hook-form';

import { Button } from '@/components/ui/button';
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
import type {
  CreateAttendanceFormValues,
  UpdateAttendanceFormValues,
} from '@/features/attendance/lib/attendance-form';

type AttendanceEventsTableProps = {
  control: Control<CreateAttendanceFormValues | UpdateAttendanceFormValues>;
  isPending: boolean;
  mode: 'create' | 'update';
};

export function AttendanceEventsTable({ control, isPending, mode }: AttendanceEventsTableProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'events' });
  const { errors } = useFormState({ control });
  const eventsError = errors.events?.message as string | undefined;

  const handleAddEvent = () => {
    const lastType = fields.length > 0 ? fields[fields.length - 1].type : undefined;
    append({ type: lastType === 'CLOCK_IN' ? 'CLOCK_OUT' : 'CLOCK_IN', time: '', reason: '' });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">Attendance Events *</h3>
          <p className="text-muted-foreground text-xs">
            Add the clock-in and clock-out events in chronological order.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddEvent}
          disabled={isPending}
        >
          <Plus data-icon="inline-start" />
          Add Event
        </Button>
      </div>

      {eventsError && <p className="text-destructive text-sm">{eventsError}</p>}

      {mode === 'update' && fields.length === 0 && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Removing all events will mark this attendance as Absent when you save.
        </p>
      )}

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead className="min-w-32 text-center">Type</TableHead>
              <TableHead className="min-w-32 text-center">Time</TableHead>
              <TableHead className="min-w-48 text-center">Notes (Optional)</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground p-4 text-center text-xs">
                  Start adding events
                </TableCell>
              </TableRow>
            )}
            {fields.length > 0 &&
              fields.map((field, index) => (
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
                          <SelectTrigger
                            className={`h-8! w-36 shadow-none ${field.type === 'CLOCK_IN' ? 'bg-green-50/50' : 'bg-red-50/50'}`}
                          >
                            <SelectValue>
                              {(selected: string) =>
                                selected === 'CLOCK_IN' ? (
                                  <span className="flex items-center gap-1.5 font-medium text-green-600 dark:text-green-400">
                                    <LogIn className="size-3" />
                                    Clock In
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5 font-medium text-red-600 dark:text-red-400">
                                    <LogOut className="size-3" />
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
                              className="h-8 min-w-32 text-xs font-light shadow-none"
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
                              placeholder="Optional notes"
                              {...reasonField}
                              disabled={isPending}
                              className="h-8 text-sm shadow-none"
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

      <div className="text-muted-foreground flex items-start gap-2 text-xs">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        <p>Events must be in chronological order: In - Out - In - Out</p>
      </div>
    </div>
  );
}
