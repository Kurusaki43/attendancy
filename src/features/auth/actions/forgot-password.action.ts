'use server';

import { z } from 'zod';

import { AppError } from '@/lib/errors/app.error';
import type { ActionResult } from '@/shared/types/action.types';

import { type ForgotPasswordInput, forgotPasswordSchema } from '../schemas/forgot-password.schema';
import { forgotPassword } from '../services/forgot-password.service';

export async function forgotPasswordAction(
  input: ForgotPasswordInput,
): Promise<ActionResult<null>> {
  const validated = forgotPasswordSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  try {
    await forgotPassword(validated.data.email);

    return {
      success: true,
      message: 'Password reset email sent successfully.',
      data: null,
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
