import { Queue } from 'bullmq';

import { redis } from '@/infrastructure/redis/client';

export function createQueue(name: string) {
  return new Queue(name, {
    connection: redis,
  });
}
