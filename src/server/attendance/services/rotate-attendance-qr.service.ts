import { randomBytes } from 'node:crypto';

import QRCode from 'qrcode';

import { redis } from '@/infrastructure/redis/client';
import { env } from '@/lib/env/env';
import type { ServiceRotateAttendanceQrResult } from '@/server/attendance/types/service-results';

export const ATTENDANCE_QR_REDIS_KEY = 'attendance:qr:current-token';

// The client polls at this cadence; the Redis TTL is padded past it so a token doesn't expire
// mid-cycle if a poll is a little late.
export const ATTENDANCE_QR_ROTATE_INTERVAL_MS = 10_000;
const QR_TOKEN_TTL_MS = ATTENDANCE_QR_ROTATE_INTERVAL_MS + 5_000;

export async function rotateAttendanceQrCode(): Promise<ServiceRotateAttendanceQrResult> {
  const token = randomBytes(24).toString('base64url');

  await redis.set(ATTENDANCE_QR_REDIS_KEY, token, 'PX', QR_TOKEN_TTL_MS);

  const scanUrl = new URL('/attendance-scan', env.APP_URL);
  scanUrl.searchParams.set('token', token);

  const qrDataUrl = await QRCode.toDataURL(scanUrl.toString(), { margin: 1, width: 320 });

  return {
    token,
    qrDataUrl,
    issuedAt: Date.now(),
    expiresInMs: ATTENDANCE_QR_ROTATE_INTERVAL_MS,
  };
}
