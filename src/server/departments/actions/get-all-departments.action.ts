'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { getAllDepartments } from '@/server/departments/services/get-all-departments.service';
import type { GetAllDepartmentsActionResult } from '@/server/departments/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getAllDepartmentsAction(
  params: Record<string, string>,
): Promise<ActionResult<GetAllDepartmentsActionResult>> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.DEPARTMENT_READ);
    return getAllDepartments(params);
  });
}
