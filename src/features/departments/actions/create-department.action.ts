'use server';

import { z } from 'zod';

import { PERMISSIONS } from '@/features/auth/constants/permissions';
import { requirePermission } from '@/features/auth/guards/require-permission';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

import {
  type CreateDepartmentInput,
  createDepartmentSchema,
} from '../schemas/create-department.schema';
import { createDepartment } from '../services/create-department.service';
import type { CreateDepartmentActionResult } from '../types/action-results';

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
