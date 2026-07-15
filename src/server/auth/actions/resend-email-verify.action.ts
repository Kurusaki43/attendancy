'use server';

import { headers } from 'next/headers';

import { AppError } from '@/lib/errors/app.error';
import { RATE_LIMITS } from '@/server/auth/constants/rate-limit.constant';
import { requireRateLimit } from '@/server/auth/guards/require-rate-limit';
import { getClientIp } from '@/server/auth/lib/get-client-ip';
import { resendEmailVerification } from '@/server/auth/services/resend-email-verification.service';
import { type ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function resendVerificationOtpAction(email: string): Promise<ActionResult<null>> {
  const headerStore = await headers();
  const ipAddress = getClientIp(headerStore);

  const result = await runAction(
    async () => {
      await requireRateLimit({
        key: `resend-verification:ip:${ipAddress}`,
        ...RATE_LIMITS.RESEND_VERIFICATION_IP,
      });
      await requireRateLimit({
        key: `resend-verification:email:${email}`,
        ...RATE_LIMITS.RESEND_VERIFICATION_EMAIL,
      });

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
