'use server';

import { headers } from 'next/headers';
import { z } from 'zod';

import { RATE_LIMITS } from '@/server/auth/constants/rate-limit.constant';
import { requireIpRateLimit, requireRateLimit } from '@/server/auth/guards/require-rate-limit';
import { setPendingPasswordResetCookie } from '@/server/auth/lib/cookies';
import { getClientIp } from '@/server/auth/lib/get-client-ip';
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from '@/server/auth/schemas/forgot-password.schema';
import { forgotPassword } from '@/server/auth/services/forgot-password.service';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function forgotPasswordAction(
  input: ForgotPasswordInput,
): Promise<ActionResult<null>> {
  const headerStore = await headers();
  const ipAddress = getClientIp(headerStore);

  const validated = forgotPasswordSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    await requireIpRateLimit(ipAddress, {
      key: `forgot-password:ip:${ipAddress}`,
      ...RATE_LIMITS.FORGOT_PASSWORD_IP,
    });
    await requireRateLimit({
      key: `forgot-password:email:${validated.data.email}`,
      ...RATE_LIMITS.FORGOT_PASSWORD_EMAIL,
    });

    await forgotPassword(validated.data.email);
    await setPendingPasswordResetCookie();
    return null;
  });

  return result.success
    ? { ...result, message: 'Password reset email sent successfully.' }
    : result;
}
