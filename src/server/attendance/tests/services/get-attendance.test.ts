import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/attendance.repository', () => ({
  attendanceRepository: {
    findById: vi.fn(),
  },
}));

const { attendanceRepository } = await import('../../repositories/attendance.repository');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { getAttendance } = await import('../../services/get-attendance.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getAttendance', () => {
  it('returns the attendance record when it exists', async () => {
    vi.mocked(attendanceRepository.findById).mockResolvedValue({ id: 'attendance-1' } as never);

    const result = await getAttendance('attendance-1');

    expect(result).toEqual({ id: 'attendance-1' });
  });

  it('throws NotFoundError when the record does not exist', async () => {
    vi.mocked(attendanceRepository.findById).mockResolvedValue(null);

    const result = getAttendance('missing-id');

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.ATTENDANCE_NOT_FOUND });
  });
});
