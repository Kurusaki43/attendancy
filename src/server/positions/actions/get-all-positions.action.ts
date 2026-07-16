'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { getAllPositions } from '@/server/positions/services/get-all-positions.service';
import type { GetAllPositionsActionResult } from '@/server/positions/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getAllPositionsAction(
  params: Record<string, string>,
): Promise<ActionResult<GetAllPositionsActionResult>> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.POSITION_READ);
    return getAllPositions(params);
  });
}
