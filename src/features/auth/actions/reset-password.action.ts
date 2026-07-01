'use server';

import { z } from 'zod';

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
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong.',
    };
  }
}
