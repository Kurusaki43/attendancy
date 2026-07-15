import ms from 'ms';

export const RATE_LIMITS = {
  LOGIN_IP: { limit: 20, windowMs: ms('15m') },
  LOGIN_EMAIL: { limit: 5, windowMs: ms('15m') },

  OTP_VERIFY_IP: { limit: 20, windowMs: ms('15m') },
  OTP_VERIFY_USER: { limit: 5, windowMs: ms('15m') },

  FORGOT_PASSWORD_IP: { limit: 10, windowMs: ms('1h') },
  FORGOT_PASSWORD_EMAIL: { limit: 3, windowMs: ms('1h') },

  RESEND_VERIFICATION_IP: { limit: 10, windowMs: ms('1h') },
  RESEND_VERIFICATION_EMAIL: { limit: 3, windowMs: ms('1h') },

  RESET_PASSWORD_IP: { limit: 10, windowMs: ms('1h') },

  REFRESH_IP: { limit: 30, windowMs: ms('15m') },
} as const;
