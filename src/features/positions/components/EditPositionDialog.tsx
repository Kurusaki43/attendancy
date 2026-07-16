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
import type { PositionResult } from '@/server/positions/types/action-results';

import { PositionForm } from './PositionForm';

type EditPositionDialogProps = {
  position: PositionResult;
};

export function EditPositionDialog({ position }: EditPositionDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <PencilIcon />
        <span className="sr-only">Edit {position.title}</span>
      </DialogTrigger>

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
