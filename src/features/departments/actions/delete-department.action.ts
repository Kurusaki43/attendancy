'use server';

import { AppError } from '@/lib/errors/app.error';
import type { ActionResult } from '@/types/action.types';

import { deleteDepartment } from '../services/delete-department.service';

export async function deleteDepartmentAction(departmentId: string): Promise<ActionResult<void>> {
  try {
    await deleteDepartment(departmentId);

    return {
      success: true,
      message: 'Department deleted successfully.',
      data: undefined,
    };
  } catch (error) {
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
