'use server';

import { z } from 'zod';

import { setPendingPasswordResetCookie } from '@/server/auth/lib/cookies';
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from '@/server/auth/schemas/forgot-password.schema';
import { forgotPassword } from '@/server/auth/services/forgot-password.service';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

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
    await setPendingPasswordResetCookie();
    return null;
  });

  return result.success
    ? { ...result, message: 'Password reset email sent successfully.' }
    : result;
}
