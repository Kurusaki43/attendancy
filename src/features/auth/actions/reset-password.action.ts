'use server';

import { z } from 'zod';

import { AppError } from '@/lib/errors/app.error';
import type { ActionResult } from '@/types/action.types';

import type { ResetPasswordInput } from '../schemas/reset-password.schema';
import { resetPasswordSchema } from '../schemas/reset-password.schema';
import { resetPassword } from '../services/reset-password.service';

export async function resetPasswordAction(input: ResetPasswordInput): Promise<ActionResult<null>> {
  const validated = resetPasswordSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  try {
    await resetPassword(validated.data);

    return {
      success: true,
      message: 'Password reset successfully.',
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
