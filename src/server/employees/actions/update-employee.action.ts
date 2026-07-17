'use server';

import { z } from 'zod';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { toEmployeeResult } from '@/server/employees/lib/to-employee-result';
import {
  type UpdateEmployeeInput,
  updateEmployeeSchema,
} from '@/server/employees/schemas/update-employee.schema';
import { updateEmployee } from '@/server/employees/services/update-employee.service';
import type { UpdateEmployeeActionResult } from '@/server/employees/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function updateEmployeeAction(
  employeeId: string,
  input: UpdateEmployeeInput,
): Promise<ActionResult<UpdateEmployeeActionResult>> {
  const validated = updateEmployeeSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    await requirePermission(PERMISSIONS.EMPLOYEE_UPDATE);
    const employee = await updateEmployee(employeeId, validated.data);
    return toEmployeeResult(employee);
  });

  return result.success ? { ...result, message: 'Employee updated successfully.' } : result;
}
