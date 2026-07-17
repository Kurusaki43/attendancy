'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { getDepartmentByCode } from '@/server/departments/services/get-department-by-code.service';
import type { GetDepartmentActionResult } from '@/server/departments/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getDepartmentByCodeAction(
  code: string,
): Promise<ActionResult<GetDepartmentActionResult>> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.DEPARTMENT_READ);
    return getDepartmentByCode(code);
  });
}
