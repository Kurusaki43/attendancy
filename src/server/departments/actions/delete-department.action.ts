'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

import { deleteDepartment } from '../services/delete-department.service';

export async function deleteDepartmentAction(departmentId: string): Promise<ActionResult<void>> {
  const result = await runAction(async () => {
    await requirePermission(PERMISSIONS.DEPARTMENT_DELETE);
    await deleteDepartment(departmentId);
  });

  return result.success ? { ...result, message: 'Department deleted successfully.' } : result;
}
