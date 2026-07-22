'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { getDepartmentAttendanceSummary } from '@/server/departments/services/get-department-attendance-summary.service';
import type { GetDepartmentAttendanceSummaryActionResult } from '@/server/departments/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getDepartmentAttendanceSummaryAction(
  departmentId: string,
): Promise<ActionResult<GetDepartmentAttendanceSummaryActionResult>> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.ATTENDANCE_READ_ALL);
    return getDepartmentAttendanceSummary(departmentId);
  });
}
