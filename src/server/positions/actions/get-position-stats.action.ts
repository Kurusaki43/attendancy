'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { getPositionStats } from '@/server/positions/services/get-position-stats.service';
import type { GetPositionStatsActionResult } from '@/server/positions/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getPositionStatsAction(): Promise<
  ActionResult<GetPositionStatsActionResult>
> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.POSITION_READ);
    return getPositionStats();
  });
}
