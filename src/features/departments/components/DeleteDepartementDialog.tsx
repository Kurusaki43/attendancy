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

import { deleteDepartmentAction } from '../actions/delete-department.action';
import type { DepartmentResult } from '../types';

type DeleteDepartmentDialogProps = {
  department: DepartmentResult;
};

export function DeleteDepartmentDialog({ department }: DeleteDepartmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeletingDepartment = () => {
    startTransition(async () => {
      const result = await deleteDepartmentAction(department.id);

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
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${department.name} department`}
          >
            <Trash className="text-destructive size-4" />
          </Button>
        }
      />

      <AlertDialogContent className="px-4 py-4 drop-shadow-2xl sm:max-w-md sm:px-6 sm:py-4">
        <AlertDialogHeader className="mb-2">
          <AlertDialogTitle className="text-xl font-semibold">
            Delete &quot;{department.name}&quot; department?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm">
            This action cannot be undone. The department will be permanently removed from the
            system.
            {/* {department.employeeCount > 0 && (
              <>
                {' '}
                This department currently contains <strong>{department.employeeCount}</strong>{' '}
                employee{department.employeeCount > 1 ? 's' : ''}.
              </>
            )} */}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-between">
          <AlertDialogCancel disabled={isPending} className={'mr-auto'}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDeletingDepartment}
            disabled={isPending}
            className="bg-destructive text-muted hover:bg-destructive/90 font-semibold"
          >
            <Trash />
            {isPending ? 'Deleting...' : 'Delete department'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteDepartmentDialog;
