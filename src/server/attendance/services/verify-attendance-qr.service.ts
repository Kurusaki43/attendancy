import { redis } from '@/infrastructure/redis/client';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { ATTENDANCE_QR_REDIS_KEY } from '@/server/attendance/services/rotate-attendance-qr.service';
import type { ServiceVerifyAttendanceQrResult } from '@/server/attendance/types/service-results';

export async function verifyAttendanceQrCode(
  token: string,
): Promise<ServiceVerifyAttendanceQrResult> {
  const currentToken = await redis.get(ATTENDANCE_QR_REDIS_KEY);

  if (!currentToken || currentToken !== token) {
    throw new BadRequestError(ERROR_CODES.ATTENDANCE_QR_INVALID, 'Invalid or expired QR code.');
  }

  return { valid: true };
}
