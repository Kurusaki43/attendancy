import { type Job, Worker } from 'bullmq';

import { redis } from '@/infrastructure/redis/client';
import { logger } from '@/lib/logger';

export function createWorker<T>(queueName: string, processor: (job: Job<T>) => Promise<void>) {
  const worker = new Worker<T>(queueName, processor, {
    connection: redis,

    concurrency: 5,
    maxStalledCount: 3,
  });

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
