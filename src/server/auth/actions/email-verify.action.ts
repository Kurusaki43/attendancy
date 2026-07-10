'use server';

import { z } from 'zod';

import { clearPendingEmailVerificationCookie } from '@/server/auth/lib/cookies';
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
  const validated = verifyEmailSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    const { code, userId } = validated.data;

    await emailVerification(code, userId);
    await clearPendingEmailVerificationCookie();

    return { emailVerified: true as const };
  });

  return result.success ? { ...result, message: 'Email verified successfully.' } : result;
}
