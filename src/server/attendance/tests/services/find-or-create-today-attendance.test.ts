import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/attendance.repository', () => ({
  attendanceRepository: {
    findByEmployeeAndDate: vi.fn(),
    create: vi.fn(),
  },
}));

const { attendanceRepository } = await import('../../repositories/attendance.repository');
const { findOrCreateTodayAttendance } =
  await import('../../services/find-or-create-today-attendance.service');

const attendance = { id: 'attendance-1', employeeId: 'employee-1' };

describe('findOrCreateTodayAttendance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-19T12:00:00.000Z'));
  });

  it("returns today's attendance record when one already exists", async () => {
    vi.mocked(attendanceRepository.findByEmployeeAndDate).mockResolvedValue(attendance as never);

    const result = await findOrCreateTodayAttendance('employee-1');

    expect(result).toBe(attendance);
    expect(attendanceRepository.create).not.toHaveBeenCalled();
  });

  it('creates a new attendance record for today when none exists yet', async () => {
    vi.mocked(attendanceRepository.findByEmployeeAndDate).mockResolvedValue(null);
    vi.mocked(attendanceRepository.create).mockResolvedValue(attendance as never);

    const result = await findOrCreateTodayAttendance('employee-1');

    expect(attendanceRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ employeeId: 'employee-1', status: 'PRESENT' }),
    );
    expect(result).toBe(attendance);
  });
});
