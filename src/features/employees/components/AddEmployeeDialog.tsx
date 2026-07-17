'use client';

import { CirclePlus } from 'lucide-react';
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

import { EmployeeForm } from './EmployeeForm';

type SelectOption = { id: string; label: string };

type AddEmployeeDialogProps = {
  departments: SelectOption[];
  positions: SelectOption[];
  managers: SelectOption[];
};

export function AddEmployeeDialog({ departments, positions, managers }: AddEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="lg"
            className={
              'bg-primary flex h-10 transform items-center font-bold uppercase duration-300 hover:scale-105'
            }
          />
        }
      >
        <CirclePlus data-icon="inline-start" />
        Add Employee
      </DialogTrigger>

      <DialogContent className="px-4 py-4 drop-shadow-2xl sm:max-w-md sm:px-8 sm:py-6">
        <DialogHeader className="mb-2">
          <DialogTitle className={'text-xl font-semibold'}>Invite New Employee</DialogTitle>
          <DialogDescription>
            An account will be created and an invite email sent so they can set their password.
          </DialogDescription>
        </DialogHeader>

        <EmployeeForm
          mode="create"
          onSuccess={handleSuccess}
          departments={departments}
          positions={positions}
          managers={managers}
        />
      </DialogContent>
    </Dialog>
  );
}
