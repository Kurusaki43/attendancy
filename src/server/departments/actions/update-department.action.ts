'use server';

import { z } from 'zod';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import {
  type UpdateDepartmentInput,
  updateDepartmentSchema,
} from '@/server/departments/schemas/update-department.schema';
import { updateDepartment } from '@/server/departments/services/update-department.service';
import type { UpdateDepartmentActionResult } from '@/server/departments/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

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
