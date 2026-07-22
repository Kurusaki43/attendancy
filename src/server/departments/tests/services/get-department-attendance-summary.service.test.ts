import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/attendance/repositories/attendance.repository', () => ({
  attendanceRepository: {
    findMany: vi.fn(),
  },
}));

const { attendanceRepository } =
  await import('@/server/attendance/repositories/attendance.repository');
const { getDepartmentAttendanceSummary } =
  await import('../../services/get-department-attendance-summary.service');

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-07-19T12:00:00.000Z'));
});

describe('getDepartmentAttendanceSummary', () => {
  it('returns zeroed stats when there are no attendance records for today', async () => {
    vi.mocked(attendanceRepository.findMany).mockResolvedValue([]);

    const result = await getDepartmentAttendanceSummary('dept-1');

    expect(result).toEqual({
      presentToday: 0,
      absentToday: 0,
      attendanceRate: 0,
      totalWorkedMinutes: 0,
      averageWorkedMinutes: 0,
    });
  });

  it("scopes the query to today's date and the given department", async () => {
    vi.mocked(attendanceRepository.findMany).mockResolvedValue([]);

    await getDepartmentAttendanceSummary('dept-1');

    expect(attendanceRepository.findMany).toHaveBeenCalledWith({
      where: { date: new Date('2026-07-19T00:00:00.000Z'), employee: { departmentId: 'dept-1' } },
    });
  });

  it('counts present and absent records and computes the attendance rate', async () => {
    vi.mocked(attendanceRepository.findMany).mockResolvedValue([
      { status: 'PRESENT', workedMinutes: 480 },
      { status: 'PRESENT', workedMinutes: 420 },
      { status: 'ABSENT', workedMinutes: 0 },
      { status: 'ON_LEAVE', workedMinutes: 0 },
    ] as never);

    const result = await getDepartmentAttendanceSummary('dept-1');

    expect(result.presentToday).toBe(2);
    expect(result.absentToday).toBe(1);
    expect(result.attendanceRate).toBe(50);
  });

  it('sums worked minutes and averages them over present employees only', async () => {
    vi.mocked(attendanceRepository.findMany).mockResolvedValue([
      { status: 'PRESENT', workedMinutes: 480 },
      { status: 'PRESENT', workedMinutes: 420 },
      { status: 'ABSENT', workedMinutes: 0 },
    ] as never);

    const result = await getDepartmentAttendanceSummary('dept-1');

    expect(result.totalWorkedMinutes).toBe(900);
    expect(result.averageWorkedMinutes).toBe(450);
  });
});
