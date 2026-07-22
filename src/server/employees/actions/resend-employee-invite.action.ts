'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { resendEmployeeInvite } from '@/server/employees/services/resend-employee-invite.service';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function resendEmployeeInviteAction(employeeId: string): Promise<ActionResult<void>> {
  const result = await runAction(async () => {
    await requirePermission(PERMISSIONS.EMPLOYEE_INVITE_RESEND);
    await resendEmployeeInvite(employeeId);
  });

  return result.success ? { ...result, message: 'Invitation resent successfully.' } : result;
}
