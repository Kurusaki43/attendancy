'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { getProfile } from '@/server/profile/services/get-profile.service';
import type { GetProfileActionResult } from '@/server/profile/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getProfileAction(): Promise<ActionResult<GetProfileActionResult>> {
  return runAction(async () => {
    const user = await requirePermission(PERMISSIONS.PROFILE_READ_SELF);
    return getProfile(user);
  });
}
