'use server';

import { z } from 'zod';

import { AppError } from '@/lib/errors/app.error';
import type { ActionResult } from '@/shared/types/action.types';

import {
  type CreateDepartmentInput,
  createDepartmentSchema,
} from '../schemas/create-department.schema';
import { createDepartment } from '../services/create-department.service';
import type { CreateDepartmentActionResult } from '../types/action-results';

export async function createDepartmentAction(
  input: CreateDepartmentInput,
): Promise<ActionResult<CreateDepartmentActionResult>> {
  const validated = createDepartmentSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  try {
    const department = await createDepartment(validated.data);

    return {
      success: true,
      message: 'Department created successfully.',
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
