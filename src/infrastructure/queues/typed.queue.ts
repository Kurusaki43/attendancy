import { type Queue } from 'bullmq';

import { type JobMap } from '@/infrastructure/jobs';

export class TypedQueue<K extends keyof JobMap> {
  constructor(private queue: Queue) {}

  add<T extends keyof JobMap[K]>(name: T, data: JobMap[K][T]) {
    return this.queue.add(String(name), data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
    });
  }
}
