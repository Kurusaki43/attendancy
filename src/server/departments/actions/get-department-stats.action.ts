'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { getDepartmentStats } from '@/server/departments/services/get-department-stats.service';
import type { GetDepartmentStatsActionResult } from '@/server/departments/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getDepartmentStatsAction(): Promise<
  ActionResult<GetDepartmentStatsActionResult>
> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.DEPARTMENT_READ);
    return getDepartmentStats();
  });
}
