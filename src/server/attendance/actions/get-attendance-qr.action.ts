'use server';

import { rotateAttendanceQrCode } from '@/server/attendance/services/rotate-attendance-qr.service';
import type { GetAttendanceQrActionResult } from '@/server/attendance/types/action-results';
import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function getAttendanceQrAction(): Promise<ActionResult<GetAttendanceQrActionResult>> {
  return runAction(async () => {
    await requirePermission(PERMISSIONS.ATTENDANCE_QR_VIEW);

    const { qrDataUrl, issuedAt, expiresInMs } = await rotateAttendanceQrCode();

    return { qrDataUrl, issuedAt, expiresInMs };
  });
}
