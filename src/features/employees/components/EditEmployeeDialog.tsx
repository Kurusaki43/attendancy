'use client';

import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { EmployeeResult } from '@/server/employees/types/action-results';

import { EmployeeForm } from './EmployeeForm';

type SelectOption = { id: string; label: string };

type EditEmployeeDialogProps = {
  employee: EmployeeResult;
  departments: SelectOption[];
  positions: SelectOption[];
  managers: SelectOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditEmployeeDialog({
  employee,
  departments,
  positions,
  managers,
  open,
  onOpenChange,
}: EditEmployeeDialogProps) {
  const router = useRouter();

  const handleSuccess = () => {
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-4 py-4 drop-shadow-2xl sm:max-w-md sm:px-8 sm:py-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-semibold">Edit Employee</DialogTitle>
          <DialogDescription>
            Update the employee&apos;s employment information. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        <EmployeeForm
          mode="update"
          employee={employee}
          onSuccess={handleSuccess}
          departments={departments}
          positions={positions}
          managers={managers}
        />
      </DialogContent>
    </Dialog>
  );
}
