import { createWorker } from '@/infrastructure/workers/base.worker';
import { logger } from '@/lib/logger';
import { attendanceQueue } from '@/server/attendance/queues/attendance.queue';
import {
  generateDailyAttendance,
  type GenerateDailyAttendanceResult,
} from '@/server/attendance/services/generate-daily-attendance.service';

const ATTENDANCE_TIMEZONE = 'UTC';

const GENERATE_DAILY_ATTENDANCE_JOB = 'generate-daily-attendance' as const;
const GENERATE_DAILY_ATTENDANCE_SCHEDULER = 'generate-daily-attendance';

const GENERATE_DAILY_ATTENDANCE_CRON = '15 20 * * *';

const GENERATE_DAILY_ATTENDANCE_ATTEMPTS = 5;

const GENERATE_DAILY_ATTENDANCE_BACKOFF = {
  type: 'exponential' as const,
  delay: 5_000,
};

export const attendanceWorker = createWorker<'attendance', GenerateDailyAttendanceResult>(
  'attendance',
  {
    [GENERATE_DAILY_ATTENDANCE_JOB]: () => generateDailyAttendance(),
  },
);

export async function registerAttendanceScheduler() {
  await attendanceQueue.upsertScheduler(
    GENERATE_DAILY_ATTENDANCE_SCHEDULER,
    {
      pattern: GENERATE_DAILY_ATTENDANCE_CRON,
      tz: ATTENDANCE_TIMEZONE,
    },
    GENERATE_DAILY_ATTENDANCE_JOB,
    {},
    {
      attempts: GENERATE_DAILY_ATTENDANCE_ATTEMPTS,
      backoff: GENERATE_DAILY_ATTENDANCE_BACKOFF,
    },
  );

  logger.info(
    {
      scheduler: GENERATE_DAILY_ATTENDANCE_SCHEDULER,
      pattern: GENERATE_DAILY_ATTENDANCE_CRON,
      timezone: ATTENDANCE_TIMEZONE,
    },
    'Attendance scheduler registered',
  );
}
