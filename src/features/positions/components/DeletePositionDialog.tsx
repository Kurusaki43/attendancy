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
import { deletePositionAction } from '@/server/positions/actions/delete-position.action';
import type { PositionResult } from '@/server/positions/types';

type DeletePositionDialogProps = {
  position: PositionResult;
};

export function DeletePositionDialog({ position }: DeletePositionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeletingPosition = () => {
    startTransition(async () => {
      const result = await deletePositionAction(position.id);

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
          <Button variant="ghost" size="icon-sm" aria-label={`Delete ${position.title} position`}>
            <Trash className="text-destructive size-4" />
          </Button>
        }
      />

      <AlertDialogContent className="px-4 py-4 drop-shadow-2xl sm:max-w-md sm:px-6 sm:py-4">
        <AlertDialogHeader className="mb-2">
          <AlertDialogTitle className="text-xl font-semibold">
            Delete &quot;{position.title}&quot; position?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm">
            This action cannot be undone. The position will be permanently removed from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-between">
          <AlertDialogCancel disabled={isPending} className={'mr-auto'}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDeletingPosition}
            disabled={isPending}
            className="bg-destructive text-muted hover:bg-destructive/90 font-semibold"
          >
            <Trash />
            {isPending ? 'Deleting...' : 'Delete position'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
