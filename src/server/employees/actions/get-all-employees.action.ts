'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { toEmployeeResult } from '@/server/employees/lib/to-employee-result';
import { getAllEmployees } from '@/server/employees/services/get-all-employees.service';
import type { GetAllEmployeesActionResult } from '@/server/employees/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getAllEmployeesAction(
  params: Record<string, string>,
): Promise<ActionResult<GetAllEmployeesActionResult>> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.EMPLOYEE_READ);
    const { employees, pagination } = await getAllEmployees(params);
    return { employees: employees.map(toEmployeeResult), pagination };
  });
}
