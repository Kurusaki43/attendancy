'use server';

import { headers } from 'next/headers';
import { z } from 'zod';

import { RATE_LIMITS } from '@/server/auth/constants/rate-limit.constant';
import { requireRateLimit } from '@/server/auth/guards/require-rate-limit';
import { clearPendingPasswordResetCookie } from '@/server/auth/lib/cookies';
import { getClientIp } from '@/server/auth/lib/get-client-ip';
import type { ResetPasswordInput } from '@/server/auth/schemas/reset-password.schema';
import { resetPasswordSchema } from '@/server/auth/schemas/reset-password.schema';
import { resetPassword } from '@/server/auth/services/reset-password.service';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function resetPasswordAction(input: ResetPasswordInput): Promise<ActionResult<null>> {
  const headerStore = await headers();
  const ipAddress = getClientIp(headerStore);

  const validated = resetPasswordSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    await requireRateLimit({
      key: `reset-password:ip:${ipAddress}`,
      ...RATE_LIMITS.RESET_PASSWORD_IP,
    });

    await resetPassword(validated.data);
    await clearPendingPasswordResetCookie();
    return null;
  });

  return result.success ? { ...result, message: 'Password reset successfully.' } : result;
}
