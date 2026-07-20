'use server';

import { z } from 'zod';

import {
  type FindAttendanceByEmployeeDateInput,
  findAttendanceByEmployeeDateSchema,
} from '@/server/attendance/schemas/find-attendance-by-employee-date.schema';
import { findAttendanceByEmployeeDate } from '@/server/attendance/services/find-attendance-by-employee-date.service';
import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function findAttendanceByEmployeeDateAction(
  input: FindAttendanceByEmployeeDateInput,
): Promise<ActionResult<{ id: string } | null>> {
  const validated = findAttendanceByEmployeeDateSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  return runAction(async () => {
    await requirePermission(PERMISSIONS.ATTENDANCE_EDIT);
    return findAttendanceByEmployeeDate(validated.data);
  });
}
