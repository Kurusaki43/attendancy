'use server';

import { z } from 'zod';

import { AppError } from '@/lib/errors/app.error';
import type { ActionResult } from '@/shared/types/action.types';

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
    if (error instanceof AppError) {
      return {
        success: false,
        code: error.code,
        message: error.message,
      };
    }

    return {
      success: false,
      message: 'Something went wrong.',
    };
  }
}
