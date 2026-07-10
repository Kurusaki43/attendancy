'use server';

import { z } from 'zod';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import {
  type CreateDepartmentInput,
  createDepartmentSchema,
} from '@/server/departments/schemas/create-department.schema';
import { createDepartment } from '@/server/departments/services/create-department.service';
import type { CreateDepartmentActionResult } from '@/server/departments/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function createDepartmentAction(
  input: CreateDepartmentInput,
): Promise<ActionResult<CreateDepartmentActionResult>> {
  const validated = createDepartmentSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    await requirePermission(PERMISSIONS.DEPARTMENT_CREATE);
    return createDepartment(validated.data);
  });

  return result.success ? { ...result, message: 'Department created successfully.' } : result;
}
