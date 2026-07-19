import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/attendance-event.repository', () => ({
  attendanceEventRepository: {
    findLastByAttendanceId: vi.fn(),
  },
}));

vi.mock('../../services/clock-in.service', () => ({
  clockIn: vi.fn(),
}));

vi.mock('../../services/clock-out.service', () => ({
  clockOut: vi.fn(),
}));

vi.mock('../../services/find-or-create-today-attendance.service', () => ({
  findOrCreateTodayAttendance: vi.fn(),
}));

vi.mock('../../services/verify-attendance-qr.service', () => ({
  verifyAttendanceQrCode: vi.fn(),
}));

const { attendanceEventRepository } =
  await import('../../repositories/attendance-event.repository');
const { clockIn } = await import('../../services/clock-in.service');
const { clockOut } = await import('../../services/clock-out.service');
const { findOrCreateTodayAttendance } =
  await import('../../services/find-or-create-today-attendance.service');
const { verifyAttendanceQrCode } = await import('../../services/verify-attendance-qr.service');
const { scanAttendance } = await import('../../services/scan-attendance.service');

const attendance = { id: 'attendance-1', employeeId: 'employee-1' };
const clockInResult = { id: 'attendance-1', status: 'PRESENT' };
const clockOutResult = { id: 'attendance-1', status: 'PRESENT' };

describe('scanAttendance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(verifyAttendanceQrCode).mockResolvedValue({ valid: true });
    vi.mocked(findOrCreateTodayAttendance).mockResolvedValue(attendance as never);
    vi.mocked(clockIn).mockResolvedValue(clockInResult as never);
    vi.mocked(clockOut).mockResolvedValue(clockOutResult as never);
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-19T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('propagates the error when the QR token is invalid', async () => {
    vi.mocked(verifyAttendanceQrCode).mockRejectedValue(new Error('Invalid or expired QR code.'));

    await expect(scanAttendance('employee-1', 'bad-token')).rejects.toThrow(
      'Invalid or expired QR code.',
    );
    expect(findOrCreateTodayAttendance).not.toHaveBeenCalled();
  });

  it('clocks in when there is no prior event today', async () => {
    vi.mocked(attendanceEventRepository.findLastByAttendanceId).mockResolvedValue(null);

    const result = await scanAttendance('employee-1', 'token');

    expect(clockIn).toHaveBeenCalledWith(attendance, 'QR');
    expect(clockOut).not.toHaveBeenCalled();
    expect(result).toEqual({ eventType: 'CLOCK_IN', attendance: clockInResult });
  });

  it('clocks out when the last event was a clock-in', async () => {
    const lastEvent = { id: 'event-1', type: 'CLOCK_IN' };
    vi.mocked(attendanceEventRepository.findLastByAttendanceId).mockResolvedValue(
      lastEvent as never,
    );

    const result = await scanAttendance('employee-1', 'token');

    expect(clockOut).toHaveBeenCalledWith(attendance, lastEvent, 'QR');
    expect(clockIn).not.toHaveBeenCalled();
    expect(result).toEqual({ eventType: 'CLOCK_OUT', attendance: clockOutResult });
  });

  it('clocks in again when the last event was a clock-out', async () => {
    const lastEvent = { id: 'event-1', type: 'CLOCK_OUT' };
    vi.mocked(attendanceEventRepository.findLastByAttendanceId).mockResolvedValue(
      lastEvent as never,
    );

    const result = await scanAttendance('employee-1', 'token');

    expect(clockIn).toHaveBeenCalledWith(attendance, 'QR');
    expect(clockOut).not.toHaveBeenCalled();
    expect(result).toEqual({ eventType: 'CLOCK_IN', attendance: clockInResult });
  });
});
