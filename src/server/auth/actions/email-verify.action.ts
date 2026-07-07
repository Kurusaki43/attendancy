'use server';

import { z } from 'zod';

import {
  type VerifyEmailInput,
  verifyEmailSchema,
} from '@/server/auth/schemas/email-verification.schema';
import type { VerifyEmailResult } from '@/server/auth/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

import { clearPendingEmailVerificationCookie } from '../lib/cookies';
import { emailVerification } from '../services/email-verification.service';

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
