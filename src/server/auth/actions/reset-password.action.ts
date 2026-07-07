'use server';

import { z } from 'zod';

import type { ResetPasswordInput } from '@/features/auth/schemas/reset-password.schema';
import { resetPasswordSchema } from '@/features/auth/schemas/reset-password.schema';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

import { resetPassword } from '../services/reset-password.service';

export async function resetPasswordAction(input: ResetPasswordInput): Promise<ActionResult<null>> {
  const validated = resetPasswordSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    await resetPassword(validated.data);
    return null;
  });

  return result.success ? { ...result, message: 'Password reset successfully.' } : result;
}
