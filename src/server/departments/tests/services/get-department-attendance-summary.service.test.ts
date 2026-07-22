import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/attendance/repositories/attendance.repository', () => ({
  attendanceRepository: {
    count: vi.fn(),
    findMany: vi.fn(),
  },
}));

vi.mock('@/server/employees/repositories/employee.repository', () => ({
  employeeRepository: {
    count: vi.fn(),
  },
}));

vi.mock('../../repositories/department.repository', () => ({
  departmentRepository: {
    findAllForEmployeeRollup: vi.fn(),
  },
}));

const { attendanceRepository } =
  await import('@/server/attendance/repositories/attendance.repository');
const { employeeRepository } = await import('@/server/employees/repositories/employee.repository');
const { departmentRepository } = await import('../../repositories/department.repository');
const { getDepartmentAttendanceSummary } =
  await import('../../services/get-department-attendance-summary.service');

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-07-19T12:00:00.000Z'));

  // Leaf by default (no children) — matches the id-only shape most tests need.
  vi.mocked(departmentRepository.findAllForEmployeeRollup).mockResolvedValue([
    { id: 'dept-1', parentId: null, _count: { employees: 0 } },
  ] as never);
  vi.mocked(employeeRepository.count).mockResolvedValue(0);
  vi.mocked(attendanceRepository.count).mockResolvedValue(0);
  vi.mocked(attendanceRepository.findMany).mockResolvedValue([]);
});

describe('getDepartmentAttendanceSummary', () => {
  it('returns zeroed stats when the department has no active employees', async () => {
    const result = await getDepartmentAttendanceSummary('dept-1');

    expect(result).toEqual({
      presentToday: 0,
      absentToday: 0,
      attendanceRate: 0,
      totalWorkedMinutes: 0,
      averageWorkedMinutes: 0,
    });
  });

  it("counts active employees and today's present records scoped to a leaf department's own id only", async () => {
    await getDepartmentAttendanceSummary('dept-1');

    expect(employeeRepository.count).toHaveBeenCalledWith({
      departmentId: { in: ['dept-1'] },
      employmentStatus: 'ACTIVE',
      user: { status: 'ACTIVE' },
    });
    expect(attendanceRepository.count).toHaveBeenCalledWith({
      date: new Date('2026-07-19T00:00:00.000Z'),
      status: 'PRESENT',
      employee: { departmentId: { in: ['dept-1'] } },
    });
  });

  it('aggregates over every descendant department when the department has children', async () => {
    vi.mocked(departmentRepository.findAllForEmployeeRollup).mockResolvedValue([
      { id: 'dept-1', parentId: null, _count: { employees: 0 } },
      { id: 'dept-2', parentId: 'dept-1', _count: { employees: 0 } },
      { id: 'dept-3', parentId: 'dept-2', _count: { employees: 0 } },
      { id: 'dept-4', parentId: 'dept-1', _count: { employees: 0 } },
      { id: 'dept-unrelated', parentId: null, _count: { employees: 0 } },
    ] as never);

    await getDepartmentAttendanceSummary('dept-1');

    expect(employeeRepository.count).toHaveBeenCalledWith({
      departmentId: { in: ['dept-1', 'dept-2', 'dept-3', 'dept-4'] },
      employmentStatus: 'ACTIVE',
      user: { status: 'ACTIVE' },
    });
  });

  it('derives absentToday from active headcount minus present count, and computes the rate off active headcount', async () => {
    vi.mocked(employeeRepository.count).mockResolvedValue(5);
    vi.mocked(attendanceRepository.count).mockResolvedValue(3);

    const result = await getDepartmentAttendanceSummary('dept-1');

    expect(result.presentToday).toBe(3);
    expect(result.absentToday).toBe(2);
    expect(result.attendanceRate).toBe(60);
  });

  it('clamps absentToday at 0 if present count somehow exceeds active headcount', async () => {
    vi.mocked(employeeRepository.count).mockResolvedValue(2);
    vi.mocked(attendanceRepository.count).mockResolvedValue(3);

    const result = await getDepartmentAttendanceSummary('dept-1');

    expect(result.absentToday).toBe(0);
  });

  it('sums worked minutes and averages them over present employees only', async () => {
    vi.mocked(employeeRepository.count).mockResolvedValue(3);
    vi.mocked(attendanceRepository.count).mockResolvedValue(2);
    vi.mocked(attendanceRepository.findMany).mockResolvedValue([
      { workedMinutes: 480 },
      { workedMinutes: 420 },
      { workedMinutes: 0 },
    ] as never);

    const result = await getDepartmentAttendanceSummary('dept-1');

    expect(result.totalWorkedMinutes).toBe(900);
    expect(result.averageWorkedMinutes).toBe(450);
  });
});
