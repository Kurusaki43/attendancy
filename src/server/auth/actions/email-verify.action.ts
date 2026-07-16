'use server';

import { headers } from 'next/headers';
import { z } from 'zod';

import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { RATE_LIMITS } from '@/server/auth/constants/rate-limit.constant';
import { requireIpRateLimit, requireRateLimit } from '@/server/auth/guards/require-rate-limit';
import {
  clearPendingEmailVerificationCookie,
  getPendingEmailVerificationCookie,
} from '@/server/auth/lib/cookies';
import { getClientIp } from '@/server/auth/lib/get-client-ip';
import {
  type VerifyEmailInput,
  verifyEmailSchema,
} from '@/server/auth/schemas/email-verification.schema';
import { emailVerification } from '@/server/auth/services/email-verification.service';
import type { VerifyEmailResult } from '@/server/auth/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function verifyEmailAction(
  input: VerifyEmailInput,
): Promise<ActionResult<VerifyEmailResult>> {
  const headerStore = await headers();
  const ipAddress = getClientIp(headerStore);

  const validated = verifyEmailSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    // The user being verified is derived from the server-set pending-verification cookie, never
    // from client input — otherwise any caller could target an arbitrary userId for OTP guessing.
    const userId = await getPendingEmailVerificationCookie();

    if (!userId) {
      throw new NotFoundError(
        ERROR_CODES.NO_PENDING_VERIFICATION,
        'No pending email verification found. Please register again.',
      );
    }

    await requireIpRateLimit(ipAddress, {
      key: `email-verify:ip:${ipAddress}`,
      ...RATE_LIMITS.OTP_VERIFY_IP,
    });
    await requireRateLimit({
      key: `email-verify:user:${userId}`,
      ...RATE_LIMITS.OTP_VERIFY_USER,
    });

    const { code } = validated.data;

    await emailVerification(code, userId);
    await clearPendingEmailVerificationCookie();

    return { emailVerified: true as const };
  });

  return result.success ? { ...result, message: 'Email verified successfully.' } : result;
}
