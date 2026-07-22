'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FieldErrors } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { AttendanceDetailsCard } from '@/features/attendance/components/AttendanceDetailsCard';
import { AttendanceSidebar } from '@/features/attendance/components/AttendanceSidebar';
import type { AttendanceEmployeeOption } from '@/features/attendance/lib/attendance-employee-option';
import {
  combineDateAndTime,
  createAttendanceFormSchema,
  type CreateAttendanceFormValues,
  toTimeInputValue,
  updateAttendanceFormSchema,
  type UpdateAttendanceFormValues,
} from '@/features/attendance/lib/attendance-form';
import { createAttendanceAction } from '@/server/attendance/actions/create-attendance.action';
import { updateAttendanceAction } from '@/server/attendance/actions/update-attendance.action';
import type { AttendanceResult } from '@/server/attendance/types/action-results';

type CreateAttendanceFormProps = {
  mode: 'create';
  initialEmployee?: AttendanceEmployeeOption | null;
  initialDate?: Date;
  attendance?: never;
};

type UpdateAttendanceFormProps = {
  mode: 'update';
  initialEmployee?: never;
  initialDate?: never;
  attendance: AttendanceResult;
};

type AttendanceFormProps = CreateAttendanceFormProps | UpdateAttendanceFormProps;

export function AttendanceForm({
  mode,
  initialEmployee,
  initialDate,
  attendance,
}: AttendanceFormProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const isUpdateMode = mode === 'update';

  const form = useForm<CreateAttendanceFormValues | UpdateAttendanceFormValues>({
    resolver: zodResolver(isUpdateMode ? updateAttendanceFormSchema : createAttendanceFormSchema),
    defaultValues: isUpdateMode
      ? {
          events: (attendance.events ?? []).map((event) => ({
            id: event.id,
            type: event.type,
            time: toTimeInputValue(event.occurredAt),
            reason: event.reason ?? '',
          })),
        }
      : {
          employeeId: initialEmployee?.id ?? '',
          date: initialDate,
          events: [],
        },
  });

  const onInvalid = (
    errors: FieldErrors<CreateAttendanceFormValues | UpdateAttendanceFormValues>,
  ) => {
    const firstError = Object.values(errors)[0];

    const message =
      (typeof firstError?.message === 'string' && firstError.message) ||
      (typeof firstError === 'object' && Object.values(firstError)[0].message) ||
      'Please fix the highlighted errors before saving.';

    toast.error(message);
  };

  const onSubmit = async (data: CreateAttendanceFormValues | UpdateAttendanceFormValues) => {
    setIsPending(true);

    const buildEvents = (date: Date) =>
      data.events
        .map((event) => ({
          ...(event.id && { id: event.id }),
          type: event.type,
          occurredAt: combineDateAndTime(date, event.time),
          reason: event.reason,
        }))
        .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());

    try {
      const result = isUpdateMode
        ? await updateAttendanceAction(attendance.id, {
            events: buildEvents(attendance.date),
          })
        : await createAttendanceAction({
            employeeId: (data as CreateAttendanceFormValues).employeeId,
            date: format((data as CreateAttendanceFormValues).date, 'yyyy-MM-dd'),
            events: buildEvents((data as CreateAttendanceFormValues).date),
          });

      if (result.success) {
        toast.success(
          result.message ??
            (isUpdateMode
              ? 'Attendance record updated successfully!'
              : 'Attendance record created successfully!'),
        );
        router.push('/dashboard/attendance/all');
      } else {
        toast.error(
          result.message ??
            (isUpdateMode
              ? 'Failed to update attendance record.'
              : 'Failed to create attendance record.'),
        );

        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && Array.isArray(messages) && messages.length > 0) {
              form.setError(
                field as keyof (CreateAttendanceFormValues & UpdateAttendanceFormValues),
                { type: 'manual', message: messages[0] },
              );
            }
          });
        }
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsPending(false);
    }
  };

  const footerButtons = (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        nativeButton={false}
        render={<Link href="/dashboard/attendance/all" />}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isPending} className="font-semibold">
        <CalendarDays data-icon="inline-start" />
        {isPending ? 'Saving...' : isUpdateMode ? 'Save Changes' : 'Save Attendance'}
      </Button>
    </>
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <div className="flex lg:col-span-2">
          {isUpdateMode ? (
            <AttendanceDetailsCard
              mode="update"
              attendance={attendance}
              control={form.control}
              isPending={isPending}
              footer={footerButtons}
            />
          ) : (
            <AttendanceDetailsCard
              mode="create"
              employee={initialEmployee ?? null}
              date={initialDate}
              control={form.control}
              isPending={isPending}
              footer={footerButtons}
            />
          )}
        </div>

        <div className="flex">
          {isUpdateMode ? (
            <AttendanceSidebar mode="update" attendance={attendance} control={form.control} />
          ) : (
            <AttendanceSidebar
              mode="create"
              employee={initialEmployee ?? null}
              date={initialDate}
              control={form.control}
            />
          )}
        </div>
      </form>
    </Form>
  );
}
