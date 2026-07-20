'use server';

import { z } from 'zod';

import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import {
  type ScanAttendanceInput,
  scanAttendanceSchema,
} from '@/server/attendance/schemas/scan-attendance.schema';
import { scanAttendance } from '@/server/attendance/services/scan-attendance.service';
import type { ScanAttendanceActionResult } from '@/server/attendance/types/action-results';
import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function scanAttendanceAction(
  input: ScanAttendanceInput,
): Promise<ActionResult<ScanAttendanceActionResult>> {
  const validated = scanAttendanceSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    const user = await requirePermission(PERMISSIONS.ATTENDANCE_CLOCK_IN);
    await requirePermission(PERMISSIONS.ATTENDANCE_CLOCK_OUT);

    const employee = await employeeRepository.findByUserId(user.id);

    if (!employee) {
      throw new NotFoundError(ERROR_CODES.EMPLOYEE_NOT_FOUND, 'Employee profile not found.');
    }

    const { eventType, attendance } = await scanAttendance(employee.id, validated.data.token);
    const lastEvent = attendance.events[attendance.events.length - 1];

    return {
      eventType,
      occurredAt: lastEvent.occurredAt,
      status: attendance.status,
      workedMinutes: attendance.workedMinutes,
      locale: user.locale,
      timezone: user.timezone,
    };
  });

  if (!result.success) {
    return result;
  }

  return {
    ...result,
    message:
      result.data.eventType === 'CLOCK_IN'
        ? 'Clocked in successfully.'
        : 'Clocked out successfully.',
  };
}
