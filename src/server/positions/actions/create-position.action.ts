'use server';

import { z } from 'zod';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import {
  type CreatePositionInput,
  createPositionSchema,
} from '@/server/positions/schemas/create-position.schema';
import { createPosition } from '@/server/positions/services/create-position.service';
import type { CreatePositionActionResult } from '@/server/positions/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function createPositionAction(
  input: CreatePositionInput,
): Promise<ActionResult<CreatePositionActionResult>> {
  const validated = createPositionSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    await requirePermission(PERMISSIONS.POSITION_CREATE);
    return createPosition(validated.data);
  });

  return result.success ? { ...result, message: 'Position created successfully.' } : result;
}
