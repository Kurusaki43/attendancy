'use client';

import type { VariantProps } from 'class-variance-authority';
import { format } from 'date-fns';
import { CirclePlus, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { DatePicker } from '@/components/shared/DatePicker';
import { Button, type buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { EmployeeCombobox } from '@/features/attendance/components/EmployeeCombobox';
import {
  getEmployeeStatusError,
  isBeforeHireDate,
  isFutureDate,
} from '@/features/attendance/lib/add-attendance-dialog-check';
import type { AttendanceEmployeeOption } from '@/features/attendance/lib/attendance-employee-option';
import { cn } from '@/lib/utils';
import { findAttendanceByEmployeeDateAction } from '@/server/attendance/actions/find-attendance-by-employee-date.action';

type AddAttendanceDialogProps = {
  variant?: VariantProps<typeof buttonVariants>['variant'];
  className?: string;
};

export function AddAttendanceDialog({ variant, className }: AddAttendanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<AttendanceEmployeeOption | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const dateError =
    date && isFutureDate(date)
      ? 'Attendance date cannot be in the future.'
      : date && selectedEmployee && isBeforeHireDate(date, selectedEmployee.hireDate)
        ? "Attendance date cannot be before the employee's hire date."
        : null;

  const employeeError = selectedEmployee ? getEmployeeStatusError(selectedEmployee) : null;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedEmployee(null);
      setDate(new Date());
    }
  };

  const handleNext = async () => {
    if (!selectedEmployee || !date || dateError || employeeError) return;

    setIsPending(true);

    try {
      const result = await findAttendanceByEmployeeDateAction({
        employeeId: selectedEmployee.id,
        date: format(date, 'yyyy-MM-dd'),
      });

      if (!result.success) {
        toast.error(result.message ?? 'Something went wrong.');
        return;
      }

      setOpen(false);
      router.push(
        result.data
          ? `/dashboard/attendance/${result.data.id}/edit`
          : `/dashboard/attendance/create?employeeId=${selectedEmployee.id}&date=${format(date, 'yyyy-MM-dd')}`,
      );
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            size="lg"
            variant={variant}
            className={cn(
              'flex h-10 transform items-center font-bold capitalize duration-300 hover:scale-105',
              !variant && 'bg-primary',
              className,
            )}
          />
        }
      >
        <CirclePlus data-icon="inline-start" />
        Add Attendance
      </DialogTrigger>

      <DialogContent className="px-4 py-4 drop-shadow-2xl sm:max-w-md sm:px-8 sm:py-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-semibold">Add Manual Attendance</DialogTitle>
          <DialogDescription>
            Select an employee and a date to create a manual attendance record.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>
              Employee <span className="text-destructive">*</span>
            </Label>
            <EmployeeCombobox
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              disabled={isPending}
            />
            {employeeError && <p className="text-destructive text-xs">{employeeError}</p>}
          </div>

          <div className="space-y-2">
            <Label>
              Attendance Date <span className="text-destructive">*</span>
            </Label>
            <DatePicker value={date} onChange={setDate} disabled={isPending} />
            {dateError && <p className="text-destructive text-xs">{dateError}</p>}
          </div>

          <div className="bg-primary/5 border-primary/20 flex items-start gap-2 rounded-md border p-2.5 text-xs">
            <Info className="text-primary mt-0.5 size-3.5 shrink-0" />
            <p className="text-muted-foreground">
              <span className="text-foreground font-medium">Manual attendance</span> — You will be
              able to add clock in/out events for the selected employee and date in the next step.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="lg"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleNext}
            disabled={isPending || !selectedEmployee || !date || !!dateError || !!employeeError}
            size="lg"
            className="font-semibold"
          >
            {isPending ? 'Checking...' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
