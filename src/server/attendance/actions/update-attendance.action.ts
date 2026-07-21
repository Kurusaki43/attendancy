'use server';

import { z } from 'zod';

import { toAttendanceResult } from '@/server/attendance/lib/to-attendance-result';
import {
  type UpdateAttendanceInput,
  updateAttendanceSchema,
} from '@/server/attendance/schemas/update-attendance.schema';
import { updateAttendance } from '@/server/attendance/services/update-attendance.service';
import type { UpdateAttendanceActionResult } from '@/server/attendance/types/action-results';
import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function updateAttendanceAction(
  attendanceId: string,
  input: UpdateAttendanceInput,
): Promise<ActionResult<UpdateAttendanceActionResult>> {
  const validated = updateAttendanceSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    await requirePermission(PERMISSIONS.ATTENDANCE_EDIT);
    const attendance = await updateAttendance(attendanceId, validated.data);
    return toAttendanceResult(attendance);
  });

  if (!result.success) {
    return result;
  }

  return {
    ...result,
    message:
      result.data.status === 'ABSENT'
        ? 'Attendance record marked as absent since it had no remaining events.'
        : 'Attendance record updated successfully.',
  };
}
