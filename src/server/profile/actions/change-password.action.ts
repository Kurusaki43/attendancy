'use server';

import { z } from 'zod';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requireAuth } from '@/server/auth/guards/require-auth';
import { requirePermission } from '@/server/auth/guards/require-permission';
import {
  type ChangePasswordInput,
  changePasswordSchema,
} from '@/server/profile/schemas/change-password.schema';
import { changePassword } from '@/server/profile/services/change-password.service';
import type { ChangePasswordActionResult } from '@/server/profile/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function changePasswordAction(
  input: ChangePasswordInput,
): Promise<ActionResult<ChangePasswordActionResult>> {
  const validated = changePasswordSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    const user = await requirePermission(PERMISSIONS.PROFILE_UPDATE_SELF);
    const { sessionId } = await requireAuth();

    await changePassword(user.id, sessionId, validated.data);

    return null;
  });

  return result.success
    ? {
        ...result,
        message: 'Password changed successfully. Other sessions have been logged out.',
      }
    : result;
}
