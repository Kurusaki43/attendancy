import { type Job, Worker } from 'bullmq';

import { type JobMap } from '@/infrastructure/jobs';
import { redis } from '@/infrastructure/redis/client';
import { logger } from '@/lib/logger';

export type JobHandlers<K extends keyof JobMap, R> = {
  [T in keyof JobMap[K]]: (data: JobMap[K][T]) => Promise<R>;
};

function jobDurationMs(job: { processedOn?: number; finishedOn?: number }) {
  return job.processedOn && job.finishedOn ? job.finishedOn - job.processedOn : undefined;
}

export function createWorker<K extends keyof JobMap, R = void>(
  queueName: K,
  handlers: JobHandlers<K, R>,
) {
  const worker = new Worker<JobMap[K][keyof JobMap[K]], R>(
    queueName,
    async (job: Job<JobMap[K][keyof JobMap[K]], R>) => {
      const handler = handlers[job.name as keyof JobMap[K]];

      if (!handler) {
        throw new Error(`Unknown ${queueName} job: ${job.name}`);
      }

      return handler(job.data);
    },
    {
      connection: redis,

      concurrency: 5,
      maxStalledCount: 3,
    },
  );

  worker.on('ready', () => {
    logger.info({ queue: queueName }, 'Worker ready');
  });

  worker.on('active', (job) => {
    logger.info(
      {
        queue: queueName,
        jobId: job.id,
        jobName: job.name,
      },
      'Job started',
    );
  });

  worker.on('completed', (job) => {
    logger.info(
      {
        queue: queueName,
        jobId: job.id,
        jobName: job.name,
        durationMs: jobDurationMs(job),
      },
      'Job completed',
    );
  });

  worker.on('failed', (job, error) => {
    logger.error(
      {
        queue: queueName,
        jobId: job?.id,
        jobName: job?.name,
        durationMs: job ? jobDurationMs(job) : undefined,
        error,
      },
      'Job failed',
    );
  });

  worker.on('error', (error) => {
    logger.error(
      {
        queue: queueName,
        error,
      },
      'Worker error',
    );
  });

  return worker;
}
