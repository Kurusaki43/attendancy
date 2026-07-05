'use server';

import { AppError } from '@/lib/errors/app.error';
import type { ActionResult } from '@/types/action.types';

import { getAllDepartments } from '../services/get-all-departments.service';
import type { GetAllDepartmentsActionResult } from '../types/action-results';

export async function getAllDepartmentsAction(): Promise<
  ActionResult<GetAllDepartmentsActionResult>
> {
  try {
    const departments = await getAllDepartments();

    return {
      success: true,
      data: departments,
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
