import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockCookieStore = {
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve(mockCookieStore),
}));

const { AUTH_COOKIES } = await import('@/server/auth/constants/auth.constant');
const { authConfig } = await import('@/server/auth/lib/auth.config');
const {
  clearAuthCookies,
  clearPendingEmailVerificationCookie,
  getAccessTokenCookie,
  getCookieOptions,
  getPendingEmailVerificationCookie,
  getRefreshTokenCookie,
  setAccessTokenCookie,
  setPendingEmailVerificationCookie,
  setRefreshTokenCookie,
} = await import('../../lib/cookies');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getCookieOptions', () => {
  it('marks cookies httpOnly, lax, and not secure outside production', () => {
    const options = getCookieOptions(60);

    expect(options).toEqual({
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60,
    });
  });
});

describe('setAccessTokenCookie', () => {
  it('sets the access token cookie with the configured max age', async () => {
    await setAccessTokenCookie('access-token-value');

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      AUTH_COOKIES.ACCESS_TOKEN,
      'access-token-value',
      expect.objectContaining({ maxAge: authConfig.accessToken.maxAge }),
    );
  });
});

describe('setRefreshTokenCookie', () => {
  it('sets the refresh token cookie with the configured max age', async () => {
    await setRefreshTokenCookie('refresh-token-value');

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      AUTH_COOKIES.REFRESH_TOKEN,
      'refresh-token-value',
      expect.objectContaining({ maxAge: authConfig.refreshToken.maxAge }),
    );
  });
});

describe('setPendingEmailVerificationCookie', () => {
  it('sets the pending verification cookie to the given userId', async () => {
    await setPendingEmailVerificationCookie('user-id');

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      AUTH_COOKIES.PENDING_EMAIL_VERIFICATION,
      'user-id',
      expect.objectContaining({ maxAge: authConfig.otp.maxAge }),
    );
  });
});

describe('getters', () => {
  it('returns the cookie value when present', async () => {
    mockCookieStore.get.mockReturnValueOnce({ value: 'access-token-value' });

    await expect(getAccessTokenCookie()).resolves.toBe('access-token-value');
  });

  it('returns null when the access token cookie is absent', async () => {
    mockCookieStore.get.mockReturnValueOnce(undefined);

    await expect(getAccessTokenCookie()).resolves.toBeNull();
  });

  it('returns null when the refresh token cookie is absent', async () => {
    mockCookieStore.get.mockReturnValueOnce(undefined);

    await expect(getRefreshTokenCookie()).resolves.toBeNull();
  });

  it('returns null when the pending verification cookie is absent', async () => {
    mockCookieStore.get.mockReturnValueOnce(undefined);

    await expect(getPendingEmailVerificationCookie()).resolves.toBeNull();
  });
});

describe('clearPendingEmailVerificationCookie', () => {
  it('deletes only the pending verification cookie', async () => {
    await clearPendingEmailVerificationCookie();

    expect(mockCookieStore.delete).toHaveBeenCalledWith(AUTH_COOKIES.PENDING_EMAIL_VERIFICATION);
    expect(mockCookieStore.delete).toHaveBeenCalledTimes(1);
  });
});

describe('clearAuthCookies', () => {
  it('deletes the access, refresh, and pending verification cookies', async () => {
    await clearAuthCookies();

    expect(mockCookieStore.delete).toHaveBeenCalledWith(AUTH_COOKIES.ACCESS_TOKEN);
    expect(mockCookieStore.delete).toHaveBeenCalledWith(AUTH_COOKIES.REFRESH_TOKEN);
    expect(mockCookieStore.delete).toHaveBeenCalledWith(AUTH_COOKIES.PENDING_EMAIL_VERIFICATION);
    expect(mockCookieStore.delete).toHaveBeenCalledTimes(3);
  });
});
