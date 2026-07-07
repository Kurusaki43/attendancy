'use server';

import { z } from 'zod';

import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

import { clearPendingEmailVerificationCookie } from '../lib/cookies';
import { type VerifyEmailInput, verifyEmailSchema } from '../schemas/email-verification.schema';
import { emailVerification } from '../services/email-verification.service';
import type { VerifyEmailResult } from '../types/action-results';

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
