'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { getPosition } from '@/server/positions/services/get-position.service';
import type { GetPositionActionResult } from '@/server/positions/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getPositionAction(
  positionId: string,
): Promise<ActionResult<GetPositionActionResult>> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.POSITION_READ);
    return getPosition(positionId);
  });
}
