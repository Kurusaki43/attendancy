'use server';

import { PERMISSIONS } from '@/features/auth/constants/permissions';
import type { GetDepartmentActionResult } from '@/features/departments/types/action-results';
import { requirePermission } from '@/server/auth/guards/require-permission';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

import { getDepartment } from '../services/get-department.service';

export async function getDepartmentAction(
  departmentId: string,
): Promise<ActionResult<GetDepartmentActionResult>> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.DEPARTMENT_READ);
    return getDepartment(departmentId);
  });
}
