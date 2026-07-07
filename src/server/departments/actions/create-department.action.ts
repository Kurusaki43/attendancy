'use server';

import { z } from 'zod';

import { PERMISSIONS } from '@/features/auth/constants/permissions';
import {
  type CreateDepartmentInput,
  createDepartmentSchema,
} from '@/features/departments/schemas/create-department.schema';
import type { CreateDepartmentActionResult } from '@/features/departments/types/action-results';
import { requirePermission } from '@/server/auth/guards/require-permission';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

import { createDepartment } from '../services/create-department.service';

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
