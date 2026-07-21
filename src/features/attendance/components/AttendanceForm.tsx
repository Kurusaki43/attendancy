'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { AttendanceAdditionalInfoSection } from '@/features/attendance/components/AttendanceAdditionalInfoSection';
import { AttendanceEmployeeDateSection } from '@/features/attendance/components/AttendanceEmployeeDateSection';
import { AttendanceEventsSection } from '@/features/attendance/components/AttendanceEventsSection';
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
  const resolvedDate = isUpdateMode ? attendance.date : initialDate;

  const form = useForm<CreateAttendanceFormValues | UpdateAttendanceFormValues>({
    resolver: zodResolver(isUpdateMode ? updateAttendanceFormSchema : createAttendanceFormSchema),
    defaultValues: isUpdateMode
      ? {
          status: attendance.status,
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
      'Please fix the highlighted errors before saving.';

    toast.error(message);
  };

  const onSubmit = async (data: CreateAttendanceFormValues | UpdateAttendanceFormValues) => {
    setIsPending(true);

    const buildEvents = (date: Date) =>
      data.events.map((event) => ({
        ...(event.id && { id: event.id }),
        type: event.type,
        occurredAt: combineDateAndTime(date, event.time),
        reason: event.reason,
      }));

    try {
      const result = isUpdateMode
        ? await updateAttendanceAction(attendance.id, {
            status: (data as UpdateAttendanceFormValues).status,
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <div className="col-span-1 space-y-4 lg:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row [&>*]:flex-1">
            {isUpdateMode ? (
              <AttendanceEmployeeDateSection mode="update" attendance={attendance} />
            ) : (
              <AttendanceEmployeeDateSection
                mode="create"
                employee={initialEmployee ?? null}
                date={initialDate}
              />
            )}
            {isUpdateMode ? (
              <AttendanceAdditionalInfoSection
                mode="update"
                control={form.control as Control<UpdateAttendanceFormValues>}
                isPending={isPending}
              />
            ) : (
              <AttendanceAdditionalInfoSection mode="create" isPending={isPending} />
            )}
          </div>

          <AttendanceEventsSection
            control={form.control}
            isPending={isPending}
            date={resolvedDate}
          />
        </div>

        <div className="space-y-4">
          <AttendanceSidebar control={form.control} date={resolvedDate} />
          <div className="flex justify-end gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={isPending}
              nativeButton={false}
              render={<Link href="/dashboard/attendance/all" />}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} size="lg" className="font-semibold">
              <CalendarDays data-icon="inline-start" />
              {isPending ? 'Saving...' : isUpdateMode ? 'Save Changes' : 'Save Attendance'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
