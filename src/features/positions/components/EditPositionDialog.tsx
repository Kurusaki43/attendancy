'use client';

import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { PositionResult } from '@/server/positions/types/action-results';

import { PositionForm } from './PositionForm';

type EditPositionDialogProps = {
  position: PositionResult;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditPositionDialog({ position, open, onOpenChange }: EditPositionDialogProps) {
  const router = useRouter();

  const handleSuccess = () => {
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-4 py-4 drop-shadow-2xl sm:max-w-md sm:px-8 sm:py-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-semibold">Edit Position</DialogTitle>
          <DialogDescription>
            Update the position information. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        <PositionForm mode="update" position={position} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
