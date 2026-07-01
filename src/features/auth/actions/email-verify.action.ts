'use server';

import { z } from 'zod';

import type { ActionResult } from '@/types/action.types';

import { clearPendingEmailVerificationCookie } from '../lib/cookies';
import { type VerifyEmailInput, verifyEmailSchema } from '../schemas/email-verification.schema';
import { emailVerification } from '../services/email-verification.service';
import type { VerifyEmailResult } from '../types/auth.types';

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

  try {
    const { code, userId } = validated.data;

    await emailVerification(code, userId);
    await clearPendingEmailVerificationCookie();

    return {
      success: true,
      message: 'Email verified successfully.',
      data: {
        emailVerified: true,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong.',
    };
  }
}
