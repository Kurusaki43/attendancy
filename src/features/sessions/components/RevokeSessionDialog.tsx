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
import { revokeSessionAction } from '@/server/auth/actions/revoke-session.action';
import type { SessionResult } from '@/server/auth/types/action-results';

type RevokeSessionDialogProps = {
  session: SessionResult;
};

export function RevokeSessionDialog({ session }: RevokeSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRevoke = () => {
    startTransition(async () => {
      const result = await revokeSessionAction(session.id);

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
          <Button variant="outline" size="sm" aria-label={`Log out ${session.browser} session`}>
            <LogOut data-icon="inline-start" />
            Revoke
          </Button>
        }
      />

      <AlertDialogContent className="px-4 py-4 drop-shadow-2xl sm:max-w-md sm:px-6 sm:py-4">
        <AlertDialogHeader className="mb-2">
          <AlertDialogTitle className="text-xl font-semibold">
            Log out of &quot;{session.browser} on {session.os}&quot;?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm">
            This device will be signed out immediately and will need to log in again to regain
            access.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-between">
          <AlertDialogCancel disabled={isPending} className="mr-auto">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleRevoke}
            disabled={isPending}
            className="bg-destructive text-muted hover:bg-destructive/90 font-semibold"
          >
            <LogOut />
            {isPending ? 'Logging out...' : 'Log out session'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
