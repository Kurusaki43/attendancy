'use server';

import { z } from 'zod';

import { clearPendingPasswordResetCookie } from '@/server/auth/lib/cookies';
import type { ResetPasswordInput } from '@/server/auth/schemas/reset-password.schema';
import { resetPasswordSchema } from '@/server/auth/schemas/reset-password.schema';
import { resetPassword } from '@/server/auth/services/reset-password.service';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

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
    await clearPendingPasswordResetCookie();
    return null;
  });

  return result.success ? { ...result, message: 'Password reset successfully.' } : result;
}
