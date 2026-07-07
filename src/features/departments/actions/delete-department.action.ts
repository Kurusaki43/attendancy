'use server';

import { unstable_rethrow } from 'next/navigation';

import { PERMISSIONS } from '@/features/auth/constants/permissions';
import { requirePermission } from '@/features/auth/guards/require-permission';
import { AppError } from '@/lib/errors/app.error';
import type { ActionResult } from '@/shared/types/action.types';

import { deleteDepartment } from '../services/delete-department.service';

export async function deleteDepartmentAction(departmentId: string): Promise<ActionResult<void>> {
  try {
    await requirePermission(PERMISSIONS.DEPARTMENT_DELETE);

    await deleteDepartment(departmentId);

    return {
      success: true,
      message: 'Department deleted successfully.',
      data: undefined,
    };
  } catch (error) {
    unstable_rethrow(error);

    if (error instanceof AppError) {
      return {
        success: false,
        code: error.code,
        message: error.message,
      };
    }

    return {
      success: false,
      message: 'Something went wrong.',
    };
  }
}
