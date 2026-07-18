'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { generateEmployeeCode } from '@/server/employees/services/generate-employee-code.service';
import type { GenerateEmployeeCodeActionResult } from '@/server/employees/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function generateEmployeeCodeAction(): Promise<
  ActionResult<GenerateEmployeeCodeActionResult>
> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.EMPLOYEE_CREATE);
    const employeeCode = await generateEmployeeCode();
    return { employeeCode };
  });
}
