'use server';

import { toAttendanceResult } from '@/server/attendance/lib/to-attendance-result';
import { getAllAttendance } from '@/server/attendance/services/get-all-attendance.service';
import type { GetAllAttendanceActionResult } from '@/server/attendance/types/action-results';
import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getAllAttendanceAction(
  params: Record<string, string>,
): Promise<ActionResult<GetAllAttendanceActionResult>> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.ATTENDANCE_READ_ALL);
    const { attendance, pagination } = await getAllAttendance(params);

    return { attendance: attendance.map(toAttendanceResult), pagination };
  });
}
