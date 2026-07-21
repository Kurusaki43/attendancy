import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
const { clockOut } = await import('../../services/clock-out.service');

const baseAttendance = {
  id: 'attendance-1',
  employeeId: 'employee-1',
  date: new Date('2026-07-19'),
  firstClockIn: new Date('2026-07-19T08:00:00.000Z'),
  lastClockOut: null,
  workedMinutes: 30,
  status: 'PRESENT',
  events: [],
} as unknown as Parameters<typeof clockOut>[0];

const lastClockInEvent = {
  id: 'event-1',
  attendanceId: 'attendance-1',
  type: 'CLOCK_IN',
  method: 'QR',
  occurredAt: new Date('2026-07-19T12:00:00.000Z'),
  createdAt: new Date('2026-07-19T12:00:00.000Z'),
} as unknown as Parameters<typeof clockOut>[1];

describe('clockOut', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(attendanceRepository.update).mockResolvedValue(baseAttendance);
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-19T12:45:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates a CLOCK_OUT event with the given method', async () => {
    await clockOut(baseAttendance, lastClockInEvent, 'QR');

    expect(attendanceEventRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        attendanceId: 'attendance-1',
        type: 'CLOCK_OUT',
        method: 'QR',
        occurredAt: new Date('2026-07-19T12:45:00.000Z'),
      }),
    );
  });

  it('adds the minutes since the last clock-in to workedMinutes, sets lastClockOut, and marks completionStatus COMPLETE', async () => {
    await clockOut(baseAttendance, lastClockInEvent, 'QR');

    expect(attendanceRepository.update).toHaveBeenCalledWith(
      'attendance-1',
      expect.objectContaining({
        lastClockOut: new Date('2026-07-19T12:45:00.000Z'),
        workedMinutes: 30 + 45,
        completionStatus: 'COMPLETE',
      }),
    );
  });
});
