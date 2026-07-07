'use server';

import { z } from 'zod';

import { PERMISSIONS } from '@/features/auth/constants/permissions';
import { requirePermission } from '@/features/auth/guards/require-permission';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

import {
  type UpdateDepartmentInput,
  updateDepartmentSchema,
} from '../schemas/update-department.schema';
import { updateDepartment } from '../services/update-department.service';
import type { UpdateDepartmentActionResult } from '../types/action-results';

export async function updateDepartmentAction(
  departmentId: string,
  input: UpdateDepartmentInput,
): Promise<ActionResult<UpdateDepartmentActionResult>> {
  const validated = updateDepartmentSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    await requirePermission(PERMISSIONS.DEPARTMENT_UPDATE);
    return updateDepartment(departmentId, validated.data);
  });

  return result.success ? { ...result, message: 'Department updated successfully.' } : result;
}
