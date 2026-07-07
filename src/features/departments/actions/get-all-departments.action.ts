'use server';

import { unstable_rethrow } from 'next/navigation';

import { PERMISSIONS } from '@/features/auth/constants/permissions';
import { requirePermission } from '@/features/auth/guards/require-permission';
import { AppError } from '@/lib/errors/app.error';
import type { ActionResult } from '@/shared/types/action.types';

import { getAllDepartments } from '../services/get-all-departments.service';
import type { GetAllDepartmentsActionResult } from '../types/action-results';

export async function getAllDepartmentsAction(
  params: Record<string, string>,
): Promise<ActionResult<GetAllDepartmentsActionResult>> {
  try {
    await requirePermission(PERMISSIONS.DEPARTMENT_READ);

    const departmentsWithPagination = await getAllDepartments(params);

    return {
      success: true,
      data: departmentsWithPagination,
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
