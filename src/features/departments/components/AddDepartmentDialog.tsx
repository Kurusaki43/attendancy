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

import { DepartmentForm } from './DepartmentForm';

export function AddDepartmentDialog() {
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
              'bg-primary flex h-10 transform items-center font-bold capitalize duration-300 hover:scale-105'
            }
          />
        }
      >
        <CirclePlus data-icon="inline-start" />
        Add Department
      </DialogTrigger>

      <DialogContent className="px-4 py-4 drop-shadow-2xl sm:max-w-md sm:px-8 sm:py-6">
        <DialogHeader className="mb-2">
          <DialogTitle className={'text-xl font-semibold'}>Create New Department</DialogTitle>
          <DialogDescription>
            Add a new department to your organization. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>

        <DepartmentForm mode="create" onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
