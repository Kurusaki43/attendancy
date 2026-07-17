import pino from 'pino';

import { env } from '@/lib/env/env';

const isDev = env.NODE_ENV !== 'production';

export const logger = pino({
  level: isDev ? (env.LOG_LEVEL ?? 'debug') : env.LOG_LEVEL,

  base: {
    service: 'attendancy-app',
    env: env.NODE_ENV,
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  serializers: {
    error: pino.stdSerializers.err,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, ignore: 'pid,hostname,service,env' },
    },
  }),
});
