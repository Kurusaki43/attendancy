'use server';

import { z } from 'zod';

import { type ForgotPasswordInput, forgotPasswordSchema } from '@/features/auth/schemas/forgot-password.schema';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

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

  const result = await runAction(async () => {
    await forgotPassword(validated.data.email);
    return null;
  });

  return result.success
    ? { ...result, message: 'Password reset email sent successfully.' }
    : result;
}
