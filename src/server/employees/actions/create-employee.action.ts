'use server';

import { z } from 'zod';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { toEmployeeResult } from '@/server/employees/lib/to-employee-result';
import {
  type CreateEmployeeInput,
  createEmployeeSchema,
} from '@/server/employees/schemas/create-employee.schema';
import { createEmployee } from '@/server/employees/services/create-employee.service';
import type { CreateEmployeeActionResult } from '@/server/employees/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function createEmployeeAction(
  input: CreateEmployeeInput,
): Promise<ActionResult<CreateEmployeeActionResult>> {
  const validated = createEmployeeSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    await requirePermission(PERMISSIONS.EMPLOYEE_CREATE);
    const employee = await createEmployee(validated.data);
    return toEmployeeResult(employee);
  });

  return result.success ? { ...result, message: 'Employee invited successfully.' } : result;
}
