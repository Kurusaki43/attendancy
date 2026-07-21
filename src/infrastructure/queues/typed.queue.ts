import { type JobSchedulerTemplateOptions, type Queue, type RepeatOptions } from 'bullmq';

import { type JobMap } from '@/infrastructure/jobs';
import { createQueue } from '@/infrastructure/queues/base.queue';

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

  /**
   * Registers (or updates) a recurring job. Safe to call on every worker boot — it's an upsert
   * keyed by `schedulerId`, so restarts/redeploys never create duplicate schedules.
   *
   * Retry behavior defaults to matching `.add()` (3 attempts, exponential backoff) — pass
   * `jobOpts` to override per job, since `upsertJobScheduler` doesn't inherit these defaults on
   * its own, and without setting `opts` a failed scheduled run wouldn't retry at all and would
   * just wait for the next scheduled tick.
   */
  upsertScheduler<T extends keyof JobMap[K]>(
    schedulerId: string,
    repeatOpts: Omit<RepeatOptions, 'key'>,
    name: T,
    data: JobMap[K][T],
    jobOpts?: JobSchedulerTemplateOptions,
  ) {
    return this.queue.upsertJobScheduler(schedulerId, repeatOpts, {
      name: String(name),
      data,
      opts: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
        ...jobOpts,
      },
    });
  }
}

/** Creates the underlying BullMQ queue and wraps it in one step, so a domain's queue file can't
 *  pass a Redis queue name that doesn't match its own TypedQueue<K> type parameter. */
export function createTypedQueue<K extends keyof JobMap>(name: K): TypedQueue<K> {
  return new TypedQueue<K>(createQueue(name));
}
