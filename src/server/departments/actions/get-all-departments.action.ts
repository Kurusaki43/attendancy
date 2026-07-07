'use server';

import { PERMISSIONS } from '@/features/auth/constants/permissions';
import type { GetAllDepartmentsActionResult } from '@/features/departments/types/action-results';
import { requirePermission } from '@/server/auth/guards/require-permission';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

import { getAllDepartments } from '../services/get-all-departments.service';

export async function getAllDepartmentsAction(
  params: Record<string, string>,
): Promise<ActionResult<GetAllDepartmentsActionResult>> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.DEPARTMENT_READ);
    return getAllDepartments(params);
  });
}
