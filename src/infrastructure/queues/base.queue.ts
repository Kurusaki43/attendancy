import { Queue } from 'bullmq';

import { type JobMap } from '@/infrastructure/jobs';
import { redis } from '@/infrastructure/redis/client';

export function createQueue<K extends keyof JobMap>(name: K) {
  return new Queue(name, {
    connection: redis,
  });
}
