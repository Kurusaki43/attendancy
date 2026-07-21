'use server';

import { toAttendanceResult } from '@/server/attendance/lib/to-attendance-result';
import { getAttendance } from '@/server/attendance/services/get-attendance.service';
import type { GetAttendanceActionResult } from '@/server/attendance/types/action-results';
import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getAttendanceAction(
  attendanceId: string,
): Promise<ActionResult<GetAttendanceActionResult>> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.ATTENDANCE_EDIT);
    const attendance = await getAttendance(attendanceId);
    return toAttendanceResult(attendance);
  });
}
