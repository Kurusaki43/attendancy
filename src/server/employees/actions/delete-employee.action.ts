'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { deleteEmployee } from '@/server/employees/services/delete-employee.service';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function deleteEmployeeAction(employeeId: string): Promise<ActionResult<void>> {
  const result = await runAction(async () => {
    await requirePermission(PERMISSIONS.EMPLOYEE_DELETE);
    await deleteEmployee(employeeId);
  });

  return result.success ? { ...result, message: 'Employee deleted successfully.' } : result;
}
