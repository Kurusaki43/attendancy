'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { deletePosition } from '@/server/positions/services/delete-position.service';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function deletePositionAction(positionId: string): Promise<ActionResult<void>> {
  const result = await runAction(async () => {
    await requirePermission(PERMISSIONS.POSITION_DELETE);
    await deletePosition(positionId);
  });

  return result.success ? { ...result, message: 'Position deleted successfully.' } : result;
}
