import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockToDataURL } = vi.hoisted(() => ({ mockToDataURL: vi.fn() }));

vi.mock('../../../../infrastructure/redis/client', () => ({
  redis: {
    set: vi.fn(),
  },
}));

vi.mock('qrcode', () => ({
  default: {
    toDataURL: mockToDataURL,
  },
}));

const { redis } = await import('../../../../infrastructure/redis/client');
const { rotateAttendanceQrCode, ATTENDANCE_QR_ROTATE_INTERVAL_MS } =
  await import('../../services/rotate-attendance-qr.service');

describe('rotateAttendanceQrCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockToDataURL.mockResolvedValue('data:image/png;base64,mock');
  });

  it('stores a fresh token in redis with a TTL padded past the rotate interval', async () => {
    await rotateAttendanceQrCode();

    expect(redis.set).toHaveBeenCalledWith(
      'attendance:qr:current-token',
      expect.any(String),
      'PX',
      ATTENDANCE_QR_ROTATE_INTERVAL_MS + 5_000,
    );
  });

  it('encodes a scan deep link carrying the same token that was stored in redis', async () => {
    const result = await rotateAttendanceQrCode();

    const [, storedToken] = vi.mocked(redis.set).mock.calls[0];
    const [encodedUrl] = mockToDataURL.mock.calls[0];
    expect(encodedUrl).toMatch(/\/attendance-scan\?token=/);
    expect(new URL(encodedUrl).searchParams.get('token')).toBe(storedToken);
    expect(result.token).toBe(storedToken);
    expect(result.qrDataUrl).toBe('data:image/png;base64,mock');
  });

  it('returns the rotate interval as expiresInMs', async () => {
    const result = await rotateAttendanceQrCode();

    expect(result.expiresInMs).toBe(ATTENDANCE_QR_ROTATE_INTERVAL_MS);
  });

  it('generates a different token on each rotation', async () => {
    const first = await rotateAttendanceQrCode();
    const second = await rotateAttendanceQrCode();

    expect(first.token).not.toBe(second.token);
  });
});
