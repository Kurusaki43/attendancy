'use client';

import { Loader2, RefreshCw } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { ActionResult } from '@/shared/types/action.types';

type Props = {
  onAction: () => Promise<ActionResult<null>>;
  idleText?: string;
  pendingText?: string;
  disabled?: boolean;
};

export function ResendButton({
  onAction,
  idleText = 'Resend code',
  pendingText = 'Sending...',
  disabled = false,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await onAction();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending || disabled}
      variant="outline"
      size="xs"
      className="mt-2 ml-2 w-fit gap-2 border-violet-500/30 text-violet-500 hover:bg-violet-500/10 hover:text-violet-400"
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        <>
          <RefreshCw className="size-4" />
          {idleText}
        </>
      )}
    </Button>
  );
}
