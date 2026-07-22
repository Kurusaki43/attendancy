import { Trash, TriangleAlert, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
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
} from '@/components/ui/alert-dialog';
import { deleteDepartmentAction } from '@/server/departments/actions/delete-department.action';
import type { DepartmentResult } from '@/server/departments/types';

type DeleteDepartmentDialogProps = {
  department: DepartmentResult;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const MAX_LISTED_CHILDREN = 5;

export function DeleteDepartmentDialog({
  department,
  open,
  onOpenChange,
}: DeleteDepartmentDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const children = department.children ?? [];
  const hasChildren = children.length > 0;
  const employeeCount = department.employeeCount ?? 0;
  const hasEmployees = employeeCount > 0;
  const isBlocked = hasChildren || hasEmployees;

  const handleDeletingDepartment = () => {
    startTransition(async () => {
      const result = await deleteDepartmentAction(department.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="px-4 py-4 drop-shadow-2xl sm:max-w-md sm:px-6 sm:py-4">
        <AlertDialogHeader className="mb-2">
          <AlertDialogTitle className="text-xl font-semibold">
            Delete &quot;{department.name}&quot; department?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm">
            {isBlocked
              ? "This department can't be deleted yet — resolve the items below first."
              : 'This action cannot be undone. The department will be permanently removed from the system.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {hasChildren && (
          <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-3 text-sm">
            <p className="text-foreground flex items-center gap-1.5 font-medium">
              <TriangleAlert className="size-4 shrink-0" />
              {children.length} sub-department{children.length === 1 ? '' : 's'}
            </p>
            <p className="text-muted-foreground mt-1">
              Move or delete these before deleting this department:
            </p>
            <ul className="text-muted-foreground mt-1.5 list-disc space-y-0.5 ps-5">
              {children.slice(0, MAX_LISTED_CHILDREN).map((child) => (
                <li key={child.id}>{child.name}</li>
              ))}
              {children.length > MAX_LISTED_CHILDREN && (
                <li>+{children.length - MAX_LISTED_CHILDREN} more</li>
              )}
            </ul>
          </div>
        )}

        {hasEmployees && (
          <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-3 text-sm">
            <p className="text-foreground flex items-center gap-1.5 font-medium">
              <Users className="size-4 shrink-0" />
              {employeeCount} employee{employeeCount === 1 ? '' : 's'}
            </p>
            <p className="text-muted-foreground mt-1">
              Reassign {employeeCount === 1 ? 'this employee' : 'these employees'} to another
              department before deleting this one.
            </p>
          </div>
        )}

        <AlertDialogFooter className="flex justify-between">
          <AlertDialogCancel disabled={isPending} className={'mr-auto'}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDeletingDepartment}
            disabled={isPending || isBlocked}
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
