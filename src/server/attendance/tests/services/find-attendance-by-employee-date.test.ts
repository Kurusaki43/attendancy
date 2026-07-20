import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/attendance.repository', () => ({
  attendanceRepository: {
    findByEmployeeAndDate: vi.fn(),
  },
}));

const { attendanceRepository } = await import('../../repositories/attendance.repository');
const { findAttendanceByEmployeeDate } =
  await import('../../services/find-attendance-by-employee-date.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('findAttendanceByEmployeeDate', () => {
  it('returns the attendance id when a record exists for that employee/date', async () => {
    vi.mocked(attendanceRepository.findByEmployeeAndDate).mockResolvedValue({
      id: 'attendance-1',
    } as never);

    const result = await findAttendanceByEmployeeDate({
      employeeId: 'employee-1',
      date: '2026-07-19',
    });

    expect(attendanceRepository.findByEmployeeAndDate).toHaveBeenCalledWith(
      'employee-1',
      new Date(Date.UTC(2026, 6, 19)),
    );
    expect(result).toEqual({ id: 'attendance-1' });
  });

  it('returns null when no record exists for that employee/date', async () => {
    vi.mocked(attendanceRepository.findByEmployeeAndDate).mockResolvedValue(null);

    const result = await findAttendanceByEmployeeDate({
      employeeId: 'employee-1',
      date: '2026-07-19',
    });

    expect(result).toBeNull();
  });
});
