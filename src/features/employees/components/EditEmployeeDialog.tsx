'use client';

import { PencilIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { EmployeeResult } from '@/server/employees/types/action-results';

import { EmployeeForm } from './EmployeeForm';

type SelectOption = { id: string; label: string };

type EditEmployeeDialogProps = {
  employee: EmployeeResult;
  departments: SelectOption[];
  positions: SelectOption[];
  managers: SelectOption[];
};

export function EditEmployeeDialog({
  employee,
  departments,
  positions,
  managers,
}: EditEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  const employeeName = `${employee.user.firstName} ${employee.user.lastName}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <PencilIcon />
        <span className="sr-only">Edit {employeeName}</span>
      </DialogTrigger>

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
