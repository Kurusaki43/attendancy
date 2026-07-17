'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { toEmployeeResult } from '@/server/employees/lib/to-employee-result';
import { getEmployee } from '@/server/employees/services/get-employee.service';
import type { GetEmployeeActionResult } from '@/server/employees/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getEmployeeAction(
  employeeId: string,
): Promise<ActionResult<GetEmployeeActionResult>> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.EMPLOYEE_READ);
    const employee = await getEmployee(employeeId);
    return toEmployeeResult(employee);
  });
}
