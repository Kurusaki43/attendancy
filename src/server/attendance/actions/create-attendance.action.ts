'use server';

import { z } from 'zod';

import { toAttendanceResult } from '@/server/attendance/lib/to-attendance-result';
import {
  type CreateAttendanceInput,
  createAttendanceSchema,
} from '@/server/attendance/schemas/create-attendance.schema';
import { createAttendance } from '@/server/attendance/services/create-attendance.service';
import type { CreateAttendanceActionResult } from '@/server/attendance/types/action-results';
import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function createAttendanceAction(
  input: CreateAttendanceInput,
): Promise<ActionResult<CreateAttendanceActionResult>> {
  const validated = createAttendanceSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    await requirePermission(PERMISSIONS.ATTENDANCE_EDIT);
    const attendance = await createAttendance(validated.data);
    return toAttendanceResult(attendance);
  });

  return result.success
    ? { ...result, message: 'Attendance record created successfully.' }
    : result;
}
