import { logger } from '@/lib/logger';
import {
  attendanceWorker,
  registerAttendanceScheduler,
} from '@/server/attendance/workers/attendance.worker';
import { emailWorker } from '@/server/mail/workers/mail.worker';

const workers = [emailWorker, attendanceWorker];

let shuttingDown = false;

async function shutdown(signal: NodeJS.Signals) {
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info({ signal }, 'Shutting down workers');

  // Worker#close() waits for in-flight jobs to finish before returning, so a deploy/restart
  // doesn't kill a job mid-run — Docker's `restart: unless-stopped` and Railway redeploys both
  // send SIGTERM to this process routinely, not just on rare crashes.
  await Promise.all(workers.map((worker) => worker.close()));

  process.exit(0);
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

registerAttendanceScheduler().catch((error: unknown) => {
  logger.error({ error }, 'Failed to register attendance scheduler, exiting');
  process.exit(1);
});
