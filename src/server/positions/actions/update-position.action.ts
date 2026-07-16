'use server';

import { z } from 'zod';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import {
  type UpdatePositionInput,
  updatePositionSchema,
} from '@/server/positions/schemas/update-position.schema';
import { updatePosition } from '@/server/positions/services/update-position.service';
import type { UpdatePositionActionResult } from '@/server/positions/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function updatePositionAction(
  positionId: string,
  input: UpdatePositionInput,
): Promise<ActionResult<UpdatePositionActionResult>> {
  const validated = updatePositionSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    await requirePermission(PERMISSIONS.POSITION_UPDATE);
    return updatePosition(positionId, validated.data);
  });

  return result.success ? { ...result, message: 'Position updated successfully.' } : result;
}
