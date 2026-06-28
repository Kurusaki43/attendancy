import { type Job, Worker } from 'bullmq';

import { redis } from '../redis/client';

export function createWorker<TData>(
  queueName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processor: (job: Job<TData>) => Promise<any>,
) {
  return new Worker(queueName, processor, {
    connection: redis,
    concurrency: 5,
  });
}
