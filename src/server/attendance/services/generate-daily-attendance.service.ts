import { logger } from '@/lib/logger';
import {
  createAbsentAttendance,
  loadAllActiveEmployeeIds,
  loadEmployeeIdsWithAttendance,
} from '@/server/attendance/lib/generate-daily-attendance-batch';
import { isUtcWeekend, startOfUtcDay } from '@/shared/utils/date';

export type GenerateDailyAttendancePayload = Record<string, never>;

export type JobStatus = 'SUCCESS' | 'FAILED';

export type GenerateDailyAttendanceResult = {
  attendanceDate: Date;
  skippedWeekend: boolean;
  activeEmployeesScanned: number;
  attendanceRecordsCreated: number;
  alreadyHadAttendance: number;
  attempts: number;
  status: JobStatus;
};

const MAX_GENERATION_ATTEMPTS = 3;

/**
 * Marks every active employee still missing an attendance row for `attendanceDate` as ABSENT.
 * Meant to run once a day, late enough that anyone who was going to clock in already has (see the
 * daily worker's cron registration for the schedule). No-ops on weekends since there's nothing to
 * be absent from.
 *
 * Verifies its own work by employee-ID set (not row counts — equal counts don't guarantee the
 * right employees got a row) after every generation attempt, retrying up to
 * MAX_GENERATION_ATTEMPTS times if some employees are still missing. If employees are still
 * missing after the last attempt, this throws so BullMQ's own retry (configured in
 * attendance.worker.ts) picks it up on a later run — inserts are idempotent
 * (@@unique([employeeId, date]) + skipDuplicates), so repeated/retried runs are always safe.
 */
export async function generateDailyAttendance(): Promise<GenerateDailyAttendanceResult> {
  const attendanceDate = startOfUtcDay();

  if (isUtcWeekend(attendanceDate)) {
    logger.info({ attendanceDate }, 'generateDailyAttendance skipped: weekend');
    return {
      attendanceDate,
      skippedWeekend: true,
      activeEmployeesScanned: 0,
      attendanceRecordsCreated: 0,
      alreadyHadAttendance: 0,
      attempts: 0,
      status: 'SUCCESS',
    };
  }

  const activeEmployeeIds = await loadAllActiveEmployeeIds();
  const activeEmployeesScanned = activeEmployeeIds.length;

  const initiallyExisting = await loadEmployeeIdsWithAttendance(attendanceDate, activeEmployeeIds);
  const alreadyHadAttendance = initiallyExisting.size;

  let missingEmployeeIds = activeEmployeeIds.filter((id) => !initiallyExisting.has(id));

  let attendanceRecordsCreated = 0;
  let attempts = 0;

  while (missingEmployeeIds.length > 0 && attempts < MAX_GENERATION_ATTEMPTS) {
    attempts += 1;

    attendanceRecordsCreated += await createAbsentAttendance(missingEmployeeIds, attendanceDate);

    const nowExisting = await loadEmployeeIdsWithAttendance(attendanceDate, missingEmployeeIds);
    const stillMissing = missingEmployeeIds.filter((id) => !nowExisting.has(id));

    logger.info(
      {
        attendanceDate,
        attempt: attempts,
        activeEmployeesScanned,
        alreadyHadAttendance,
        createdThisAttempt: missingEmployeeIds.length - stillMissing.length,
        missingAfterVerification: stillMissing.length,
      },
      `generateDailyAttendance attempt ${attempts}`,
    );

    missingEmployeeIds = stillMissing;
  }

  if (missingEmployeeIds.length > 0) {
    logger.error(
      {
        attendanceDate,
        attempts,
        missingEmployeeIds,
        status: 'FAILED' satisfies JobStatus,
      },
      'generateDailyAttendance failed: employees still missing attendance after max attempts',
    );
    throw new Error(
      `generateDailyAttendance: ${missingEmployeeIds.length} employee(s) still missing attendance ` +
        `for ${attendanceDate.toISOString().slice(0, 10)} after ${MAX_GENERATION_ATTEMPTS} attempts: ` +
        missingEmployeeIds.join(', '),
    );
  }

  const result: GenerateDailyAttendanceResult = {
    attendanceDate,
    skippedWeekend: false,
    activeEmployeesScanned,
    attendanceRecordsCreated,
    alreadyHadAttendance,
    attempts,
    status: 'SUCCESS',
  };

  logger.info(result, 'generateDailyAttendance succeeded');

  return result;
}
