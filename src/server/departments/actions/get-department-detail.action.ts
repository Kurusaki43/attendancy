'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { getDepartmentDetail } from '@/server/departments/services/get-department-detail.service';
import type { GetDepartmentDetailActionResult } from '@/server/departments/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getDepartmentDetailAction(
  code: string,
): Promise<ActionResult<GetDepartmentDetailActionResult>> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.DEPARTMENT_READ);
    const { _count, overview, ...department } = await getDepartmentDetail(code);

    return {
      ...department,
      employeeCount: _count.employees,
      overview,
    };
  });
}
