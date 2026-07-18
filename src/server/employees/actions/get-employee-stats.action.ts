'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { getEmployeeStats } from '@/server/employees/services/get-employee-stats.service';
import type { GetEmployeeStatsActionResult } from '@/server/employees/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getEmployeeStatsAction(): Promise<
  ActionResult<GetEmployeeStatsActionResult>
> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.EMPLOYEE_READ);
    return getEmployeeStats();
  });
}
