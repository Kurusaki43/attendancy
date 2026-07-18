import ms from 'ms';

import { env } from '@/lib/env/env';
import { humanizeDuration } from '@/shared/utils/humanize-duration';

// How long a just-rotated-away refresh token is still accepted after being superseded. Covers
// concurrent requests (parallel tabs, prefetch + navigation, etc.) that race on the same
// pre-rotation token, so the loser isn't treated as reuse/theft and doesn't get logged out.
const REFRESH_TOKEN_REUSE_GRACE_MS = 30_000;

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

    graceExpiresAt() {
      return new Date(Date.now() + REFRESH_TOKEN_REUSE_GRACE_MS);
    },
  },

  otp: {
    expiresIn: env.OTP_EXPIRED_IN,
    expiresInHuman: humanizeDuration(env.OTP_EXPIRED_IN),
    maxAge: Math.floor(ms(env.OTP_EXPIRED_IN) / 1000),

    expiresAt() {
      return new Date(Date.now() + ms(env.OTP_EXPIRED_IN));
    },
  },
} as const;
