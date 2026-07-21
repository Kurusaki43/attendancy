import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/attendance.repository', () => ({
  attendanceRepository: {
    findExistingEmployeeIdsForDate: vi.fn(),
    createMany: vi.fn(),
  },
}));

vi.mock('@/server/employees/repositories/employee.repository', () => ({
  employeeRepository: {
    findActiveEmployeeIds: vi.fn(),
  },
}));

const { attendanceRepository } = await import('../../repositories/attendance.repository');
const { employeeRepository } = await import('@/server/employees/repositories/employee.repository');
const { logger } = await import('@/lib/logger');
const { generateDailyAttendance } =
  await import('../../services/generate-daily-attendance.service');

// 2026-07-21 is a Tuesday; 2026-07-18 is the preceding Saturday.
const WEEKDAY = new Date('2026-07-21T12:00:00.000Z');
const WEEKEND = new Date('2026-07-18T12:00:00.000Z');
const ATTENDANCE_DATE = new Date(Date.UTC(2026, 6, 21));

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(WEEKDAY);
  vi.spyOn(logger, 'info').mockImplementation(() => undefined as never);
  vi.spyOn(logger, 'error').mockImplementation(() => undefined as never);

  vi.mocked(employeeRepository.findActiveEmployeeIds).mockResolvedValue([]);
  vi.mocked(attendanceRepository.findExistingEmployeeIdsForDate).mockResolvedValue([]);
  vi.mocked(attendanceRepository.createMany).mockImplementation(
    (data) => Promise.resolve({ count: data.length }) as never,
  );
});

afterEach(() => {
  vi.useRealTimers();
});

describe('generateDailyAttendance', () => {
  it('skips weekends without querying employees or attendance', async () => {
    vi.setSystemTime(WEEKEND);

    const result = await generateDailyAttendance();

    expect(result).toEqual({
      attendanceDate: new Date(Date.UTC(2026, 6, 18)),
      skippedWeekend: true,
      activeEmployeesScanned: 0,
      attendanceRecordsCreated: 0,
      alreadyHadAttendance: 0,
      attempts: 0,
      status: 'SUCCESS',
    });
    expect(employeeRepository.findActiveEmployeeIds).not.toHaveBeenCalled();
    expect(attendanceRepository.createMany).not.toHaveBeenCalled();
  });

  it('does nothing when there are no active employees', async () => {
    const result = await generateDailyAttendance();

    expect(result.activeEmployeesScanned).toBe(0);
    expect(result.attendanceRecordsCreated).toBe(0);
    expect(result.attempts).toBe(0);
    expect(result.status).toBe('SUCCESS');
    expect(attendanceRepository.createMany).not.toHaveBeenCalled();
  });

  it('makes zero attempts when every active employee already has attendance', async () => {
    vi.mocked(employeeRepository.findActiveEmployeeIds).mockResolvedValueOnce([
      'employee-1',
      'employee-2',
    ]);
    vi.mocked(attendanceRepository.findExistingEmployeeIdsForDate).mockResolvedValueOnce([
      'employee-1',
      'employee-2',
    ]);

    const result = await generateDailyAttendance();

    expect(result.attempts).toBe(0);
    expect(result.alreadyHadAttendance).toBe(2);
    expect(result.attendanceRecordsCreated).toBe(0);
    expect(attendanceRepository.createMany).not.toHaveBeenCalled();
  });

  it('creates ABSENT records for missing employees and succeeds on the first attempt', async () => {
    vi.mocked(employeeRepository.findActiveEmployeeIds).mockResolvedValueOnce([
      'employee-1',
      'employee-2',
      'employee-3',
    ]);
    // Initial check: employee-1 already has attendance.
    vi.mocked(attendanceRepository.findExistingEmployeeIdsForDate)
      .mockResolvedValueOnce(['employee-1'])
      // Attempt-1 verification: both created rows are confirmed present.
      .mockResolvedValueOnce(['employee-2', 'employee-3']);

    const result = await generateDailyAttendance();

    expect(attendanceRepository.createMany).toHaveBeenCalledTimes(1);
    expect(attendanceRepository.createMany).toHaveBeenCalledWith([
      { employeeId: 'employee-2', date: ATTENDANCE_DATE, status: 'ABSENT', completionStatus: null },
      { employeeId: 'employee-3', date: ATTENDANCE_DATE, status: 'ABSENT', completionStatus: null },
    ]);
    expect(result).toMatchObject({
      activeEmployeesScanned: 3,
      alreadyHadAttendance: 1,
      attendanceRecordsCreated: 2,
      attempts: 1,
      status: 'SUCCESS',
    });
  });

  it('retries only the still-missing employees and succeeds on a later attempt', async () => {
    vi.mocked(employeeRepository.findActiveEmployeeIds).mockResolvedValueOnce([
      'employee-1',
      'employee-2',
    ]);
    vi.mocked(attendanceRepository.findExistingEmployeeIdsForDate)
      .mockResolvedValueOnce([]) // initial check: nobody has attendance yet
      .mockResolvedValueOnce(['employee-1']) // attempt 1 verify: only employee-1 confirmed
      .mockResolvedValueOnce(['employee-2']); // attempt 2 verify: employee-2 now confirmed too
    // Attempt 1's createMany silently drops employee-2 (simulating a transient failure).
    vi.mocked(attendanceRepository.createMany).mockResolvedValueOnce({ count: 1 });

    const result = await generateDailyAttendance();

    expect(attendanceRepository.createMany).toHaveBeenCalledTimes(2);
    expect(attendanceRepository.createMany).toHaveBeenNthCalledWith(1, [
      { employeeId: 'employee-1', date: ATTENDANCE_DATE, status: 'ABSENT', completionStatus: null },
      { employeeId: 'employee-2', date: ATTENDANCE_DATE, status: 'ABSENT', completionStatus: null },
    ]);
    expect(attendanceRepository.createMany).toHaveBeenNthCalledWith(2, [
      { employeeId: 'employee-2', date: ATTENDANCE_DATE, status: 'ABSENT', completionStatus: null },
    ]);
    expect(result.attempts).toBe(2);
    expect(result.status).toBe('SUCCESS');
  });

  it('throws after exhausting all attempts, logging the still-missing employee IDs', async () => {
    vi.mocked(employeeRepository.findActiveEmployeeIds).mockResolvedValueOnce(['employee-1']);
    // Every check (initial + all 3 verify attempts) reports employee-1 as still missing.
    vi.mocked(attendanceRepository.findExistingEmployeeIdsForDate).mockResolvedValue([]);

    await expect(generateDailyAttendance()).rejects.toThrow(/employee-1/);

    expect(attendanceRepository.createMany).toHaveBeenCalledTimes(3);
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        attempts: 3,
        missingEmployeeIds: ['employee-1'],
        status: 'FAILED',
      }),
      expect.stringContaining('still missing attendance after max attempts'),
    );
  });

  it('chunks employee listing, verification, and creation in batches of 500', async () => {
    const firstPage = Array.from({ length: 500 }, (_, index) => `employee-${index}`);
    const secondPage = ['employee-500'];

    vi.mocked(employeeRepository.findActiveEmployeeIds)
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(secondPage);

    let verifyCallCount = 0;
    vi.mocked(attendanceRepository.findExistingEmployeeIdsForDate).mockImplementation(
      async (_date, ids) => {
        verifyCallCount += 1;
        // First two calls are the initial existence check (nobody has attendance yet); the next
        // two are the attempt-1 verification, by which point everyone has been created.
        return verifyCallCount <= 2 ? [] : ids;
      },
    );

    const result = await generateDailyAttendance();

    expect(employeeRepository.findActiveEmployeeIds).toHaveBeenCalledTimes(2);
    expect(attendanceRepository.findExistingEmployeeIdsForDate).toHaveBeenCalledTimes(4);
    expect(attendanceRepository.createMany).toHaveBeenCalledTimes(2);
    expect(attendanceRepository.createMany).toHaveBeenNthCalledWith(
      1,
      expect.arrayContaining([expect.objectContaining({ employeeId: 'employee-0' })]),
    );
    expect(
      (attendanceRepository.createMany as ReturnType<typeof vi.fn>).mock.calls[0][0],
    ).toHaveLength(500);
    expect(
      (attendanceRepository.createMany as ReturnType<typeof vi.fn>).mock.calls[1][0],
    ).toHaveLength(1);
    expect(result.activeEmployeesScanned).toBe(501);
    expect(result.attendanceRecordsCreated).toBe(501);
    expect(result.attempts).toBe(1);
    expect(result.status).toBe('SUCCESS');
  });
});
