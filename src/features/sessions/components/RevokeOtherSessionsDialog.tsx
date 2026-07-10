'use client';

import { LogOut } from 'lucide-react';
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
import { revokeOtherSessionsAction } from '@/server/auth/actions/revoke-other-sessions.action';

export function RevokeOtherSessionsDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRevokeOthers = () => {
    startTransition(async () => {
      const result = await revokeOtherSessionsAction();

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
            size="lg"
            className="bg-primary flex h-10 transform items-center font-bold uppercase duration-300 hover:scale-105"
          />
        }
      >
        <LogOut data-icon="inline-start" />
        Log out of all other sessions
      </AlertDialogTrigger>

      <AlertDialogContent className="px-4 py-4 drop-shadow-2xl sm:max-w-md sm:px-6 sm:py-4">
        <AlertDialogHeader className="mb-2">
          <AlertDialogTitle className="text-xl font-semibold">
            Log out of all other sessions?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm">
            Every other device currently signed into your account will be logged out immediately.
            This device stays signed in.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-between">
          <AlertDialogCancel disabled={isPending} className="mr-auto">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleRevokeOthers}
            disabled={isPending}
            className="bg-destructive text-muted hover:bg-destructive/90 font-semibold"
          >
            <LogOut />
            {isPending ? 'Logging out...' : 'Log out other sessions'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
