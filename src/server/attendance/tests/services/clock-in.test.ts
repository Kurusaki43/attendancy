import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/attendance-event.repository', () => ({
  attendanceEventRepository: {
    create: vi.fn(),
  },
}));

vi.mock('../../repositories/attendance.repository', () => ({
  attendanceRepository: {
    update: vi.fn(),
  },
}));

const { attendanceEventRepository } =
  await import('../../repositories/attendance-event.repository');
const { attendanceRepository } = await import('../../repositories/attendance.repository');
const { clockIn } = await import('../../services/clock-in.service');

const baseAttendance = {
  id: 'attendance-1',
  employeeId: 'employee-1',
  date: new Date('2026-07-19'),
  firstClockIn: null,
  lastClockOut: null,
  workedMinutes: 0,
  status: 'ABSENT',
  events: [],
} as unknown as Parameters<typeof clockIn>[0];

describe('clockIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(attendanceRepository.update).mockResolvedValue(baseAttendance);
  });

  it('creates a CLOCK_IN event with the given method', async () => {
    await clockIn(baseAttendance, 'QR');

    expect(attendanceEventRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        attendanceId: 'attendance-1',
        type: 'CLOCK_IN',
        method: 'QR',
        occurredAt: expect.any(Date),
      }),
    );
  });

  it('sets status to PRESENT and firstClockIn when this is the first clock-in of the day', async () => {
    await clockIn(baseAttendance, 'QR');

    expect(attendanceRepository.update).toHaveBeenCalledWith(
      'attendance-1',
      expect.objectContaining({
        status: 'PRESENT',
        firstClockIn: expect.any(Date),
      }),
    );
  });

  it('does not override firstClockIn if the attendance record already has one', async () => {
    const existingFirstClockIn = new Date('2026-07-19T08:00:00.000Z');

    await clockIn({ ...baseAttendance, firstClockIn: existingFirstClockIn }, 'QR');

    expect(attendanceRepository.update).toHaveBeenCalledWith(
      'attendance-1',
      expect.objectContaining({ firstClockIn: existingFirstClockIn }),
    );
  });
});
