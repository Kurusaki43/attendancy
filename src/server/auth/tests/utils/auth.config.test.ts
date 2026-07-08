import { describe, expect, it } from 'vitest';

import { authConfig } from '@/server/auth/lib/auth.config';

describe('authConfig', () => {
  it('converts the access token expiry (15m) into seconds', () => {
    expect(authConfig.accessToken.maxAge).toBe(15 * 60);
  });

  it('converts the refresh token expiry (7d) into seconds', () => {
    expect(authConfig.refreshToken.maxAge).toBe(7 * 24 * 60 * 60);
  });

  it('converts the OTP expiry (15m) into seconds', () => {
    expect(authConfig.otp.maxAge).toBe(15 * 60);
  });

  it('computes a refresh token expiry date in the future', () => {
    const before = Date.now();
    const expiresAt = authConfig.refreshToken.expiresAt();
    const after = Date.now();

    expect(expiresAt.getTime()).toBeGreaterThanOrEqual(before + authConfig.refreshToken.maxAge * 1000);
    expect(expiresAt.getTime()).toBeLessThanOrEqual(after + authConfig.refreshToken.maxAge * 1000);
  });

  it('computes an OTP expiry date in the future', () => {
    const now = Date.now();
    const expiresAt = authConfig.otp.expiresAt();

    expect(expiresAt.getTime()).toBeGreaterThan(now);
  });
});
