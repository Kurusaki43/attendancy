'use client';

import { Loader2, RefreshCw } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { resendVerificationAction } from '../actions/resen-email-verify';

export function ResendButton({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();

  const handleResend = () => {
    startTransition(async () => {
      await new Promise((res) => setTimeout(res, 3000));
      const res = await resendVerificationAction(email);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
    });
  };

  return (
    <Button
      onClick={handleResend}
      disabled={isPending}
      variant="outline"
      size="xs"
      className="mt-2 ml-2 w-fit gap-2 border-violet-500/30 text-violet-500 hover:bg-violet-500/10 hover:text-violet-400"
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4" />
          Resend code
        </>
      )}
    </Button>
  );
}
