'use server';

import { unstable_rethrow } from 'next/navigation';

import { PERMISSIONS } from '@/features/auth/constants/permissions';
import { requirePermission } from '@/features/auth/guards/require-permission';
import { AppError } from '@/lib/errors/app.error';
import type { ActionResult } from '@/shared/types/action.types';

import { getDepartment } from '../services/get-department.service';
import type { GetDepartmentActionResult } from '../types/action-results';

export async function getDepartmentAction(
  departmentId: string,
): Promise<ActionResult<GetDepartmentActionResult>> {
  try {
    await requirePermission(PERMISSIONS.DEPARTMENT_READ);

    const department = await getDepartment(departmentId);

    return {
      success: true,
      data: department,
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
