'use server';

import { z } from 'zod';

import { AppError } from '@/lib/errors/app.error';
import type { ActionResult } from '@/shared/types/action.types';

import {
  type UpdateDepartmentInput,
  updateDepartmentSchema,
} from '../schemas/update-department.schema';
import { updateDepartment } from '../services/update-department.service';
import type { UpdateDepartmentActionResult } from '../types/action-results';

export async function updateDepartmentAction(
  departmentId: string,
  input: UpdateDepartmentInput,
): Promise<ActionResult<UpdateDepartmentActionResult>> {
  const validated = updateDepartmentSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  try {
    const department = await updateDepartment(departmentId, validated.data);

    return {
      success: true,
      message: 'Department updated successfully.',
      data: department,
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
