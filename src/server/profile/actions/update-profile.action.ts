'use server';

import { z } from 'zod';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import {
  type UpdateProfileInput,
  updateProfileSchema,
} from '@/server/profile/schemas/update-profile.schema';
import { updateProfile } from '@/server/profile/services/update-profile.service';
import type { UpdateProfileActionResult } from '@/server/profile/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function updateProfileAction(
  input: UpdateProfileInput,
): Promise<ActionResult<UpdateProfileActionResult>> {
  const validated = updateProfileSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    const user = await requirePermission(PERMISSIONS.PROFILE_UPDATE_SELF);
    return updateProfile(user.id, validated.data);
  });

  return result.success ? { ...result, message: 'Profile updated successfully.' } : result;
}
