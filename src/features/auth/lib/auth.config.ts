import ms from 'ms';

import { env } from '@/lib/env/env';

export const authConfig = {
  accessToken: {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    maxAge: Math.floor(ms(env.JWT_ACCESS_EXPIRES_IN) / 1000),
  },

  refreshToken: {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    maxAge: Math.floor(ms(env.JWT_REFRESH_EXPIRES_IN) / 1000),

    expiresAt() {
      return new Date(Date.now() + ms(env.JWT_REFRESH_EXPIRES_IN));
    },
  },

  otp: {
    expiresIn: env.OTP_EXPIRED_IN,
    maxAge: Math.floor(ms(env.OTP_EXPIRED_IN) / 1000),

    expiresAt() {
      return new Date(Date.now() + ms(env.OTP_EXPIRED_IN));
    },
  },
} as const;
