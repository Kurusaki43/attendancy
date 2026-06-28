import Redis from 'ioredis';

import { env } from '@/lib/env';

const globalForRedis = globalThis as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ??
  new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,

    maxRetriesPerRequest: null,
  });

if (env.NODE_ENV !== 'production') globalForRedis.redis = redis;
