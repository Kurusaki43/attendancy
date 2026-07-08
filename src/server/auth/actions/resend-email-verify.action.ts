'use server';

import { AppError } from '@/lib/errors/app.error';
import { resendEmailVerification } from '@/server/auth/services/resend-email-verification.service';
import { type ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function resendVerificationOtpAction(email: string): Promise<ActionResult<null>> {
  const result = await runAction(
    async () => {
      await resendEmailVerification(email);
      return null;
    },
    {
      onError: (error) =>
        error instanceof AppError
          ? undefined
          : { success: false, message: 'Failed to resend verification code.' },
    },
  );

  return result.success ? { ...result, message: 'Code resent successfully' } : result;
}
