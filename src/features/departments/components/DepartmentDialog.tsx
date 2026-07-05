'use client';

import { PencilIcon, PlusIcon } from 'lucide-react';
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

import type { DepartmentResult } from '../types/action-results';
import { DepartmentForm } from './DepartmentForm';

type CreateDepartmentDialogProps = {
  mode: 'create';
  department?: never;
};

type UpdateDepartmentDialogProps = {
  mode: 'update';
  department: DepartmentResult;
};

type DepartmentDialogProps = CreateDepartmentDialogProps | UpdateDepartmentDialogProps;

export function DepartmentDialog({ mode, department }: DepartmentDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const isUpdateMode = mode === 'update';

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant={isUpdateMode ? 'ghost' : 'default'}
            size={isUpdateMode ? 'icon-sm' : 'default'}
          />
        }
      >
        {isUpdateMode ? (
          <>
            <PencilIcon />
            <span className="sr-only">Edit {department.name}</span>
          </>
        ) : (
          <>
            <PlusIcon data-icon="inline-start" />
            Add Department
          </>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isUpdateMode ? 'Edit Department' : 'Create New Department'}</DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? 'Update the department information. Changes will be saved immediately.'
              : 'Add a new department to your organization. Fill in the required information below.'}
          </DialogDescription>
        </DialogHeader>

        {isUpdateMode ? (
          <DepartmentForm mode="update" department={department} onSuccess={handleSuccess} />
        ) : (
          <DepartmentForm mode="create" onSuccess={handleSuccess} />
        )}
      </DialogContent>
    </Dialog>
  );
}
