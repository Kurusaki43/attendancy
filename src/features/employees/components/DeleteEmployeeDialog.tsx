'use client';

import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteEmployeeAction } from '@/server/employees/actions/delete-employee.action';
import type { EmployeeResult } from '@/server/employees/types/action-results';

type DeleteEmployeeDialogProps = {
  employee: EmployeeResult;
};

export function DeleteEmployeeDialog({ employee }: DeleteEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const employeeName = `${employee.user.firstName} ${employee.user.lastName}`;

  const handleDeletingEmployee = () => {
    startTransition(async () => {
      const result = await deleteEmployeeAction(employee.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label={`Delete ${employeeName}`}>
            <Trash className="text-destructive size-4" />
          </Button>
        }
      />

      <AlertDialogContent className="px-4 py-4 drop-shadow-2xl sm:max-w-md sm:px-6 sm:py-4">
        <AlertDialogHeader className="mb-2">
          <AlertDialogTitle className="text-xl font-semibold">
            Delete &quot;{employeeName}&quot;?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm">
            This action cannot be undone. The employee record and their user account will be
            permanently removed from the system, and any active sessions will be revoked.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-between">
          <AlertDialogCancel disabled={isPending} className={'mr-auto'}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDeletingEmployee}
            disabled={isPending}
            className="bg-destructive text-muted hover:bg-destructive/90 font-semibold"
          >
            <Trash />
            {isPending ? 'Deleting...' : 'Delete employee'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
