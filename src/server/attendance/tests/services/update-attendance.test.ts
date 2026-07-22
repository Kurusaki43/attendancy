import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/attendance.repository', () => ({
  attendanceRepository: {
    findById: vi.fn(),
  },
}));

vi.mock('@/server/employees/repositories/employee.repository', () => ({
  employeeRepository: {
    findById: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    attendanceEvent: { delete: vi.fn(), update: vi.fn(), createMany: vi.fn(), deleteMany: vi.fn() },
    attendance: { update: vi.fn() },
    $transaction: vi.fn(),
  },
}));

const { attendanceRepository } = await import('../../repositories/attendance.repository');
const { employeeRepository } = await import('@/server/employees/repositories/employee.repository');
const { prisma } = await import('@/lib/prisma');
const { BadRequestError } = await import('@/lib/errors/bad-request.error');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { updateAttendance } = await import('../../services/update-attendance.service');

const attendanceDate = new Date(Date.UTC(2026, 6, 19));

const existingClockIn = {
  id: 'event-1',
  type: 'CLOCK_IN',
  occurredAt: new Date('2026-07-19T09:00:00.000Z'),
  reason: 'Start of day',
};
const existingClockOut = {
  id: 'event-2',
  type: 'CLOCK_OUT',
  occurredAt: new Date('2026-07-19T17:00:00.000Z'),
  reason: 'End of day',
};

const activeEmployee = {
  id: 'employee-1',
  employmentStatus: 'ACTIVE',
  user: { status: 'ACTIVE' },
};

const presentAttendance = {
  id: 'attendance-1',
  employeeId: 'employee-1',
  date: attendanceDate,
  status: 'PRESENT',
  hasManualChanges: false,
  events: [existingClockIn, existingClockOut],
};

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(attendanceRepository.findById).mockResolvedValue(presentAttendance as never);
  vi.mocked(employeeRepository.findById).mockResolvedValue(activeEmployee as never);

  vi.mocked(prisma.attendanceEvent.delete).mockResolvedValue({} as never);
  vi.mocked(prisma.attendanceEvent.update).mockResolvedValue({} as never);
  vi.mocked(prisma.attendanceEvent.createMany).mockResolvedValue({ count: 0 } as never);
  vi.mocked(prisma.attendanceEvent.deleteMany).mockResolvedValue({ count: 0 } as never);
  vi.mocked(prisma.attendance.update).mockResolvedValue({} as never);
  vi.mocked(prisma.$transaction).mockResolvedValue([]);
});

describe('updateAttendance', () => {
  it('throws NotFoundError when the attendance record does not exist', async () => {
    vi.mocked(attendanceRepository.findById).mockResolvedValue(null);

    const result = updateAttendance('missing-id', { events: [] });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.ATTENDANCE_NOT_FOUND });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the attendance is ON_LEAVE', async () => {
    vi.mocked(attendanceRepository.findById).mockResolvedValue({
      ...presentAttendance,
      status: 'ON_LEAVE',
    } as never);

    const result = updateAttendance('attendance-1', { events: [] });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.ATTENDANCE_NOT_EDITABLE });
    expect(employeeRepository.findById).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the attendance is HOLIDAY', async () => {
    vi.mocked(attendanceRepository.findById).mockResolvedValue({
      ...presentAttendance,
      status: 'HOLIDAY',
    } as never);

    const result = updateAttendance('attendance-1', { events: [] });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.ATTENDANCE_NOT_EDITABLE });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('allows editing an ABSENT attendance (transitions it to PRESENT)', async () => {
    vi.mocked(attendanceRepository.findById).mockResolvedValue({
      ...presentAttendance,
      status: 'ABSENT',
      events: [],
    } as never);

    await updateAttendance('attendance-1', {
      events: [{ type: 'CLOCK_IN', occurredAt: existingClockIn.occurredAt, reason: 'Start' }],
    });

    expect(prisma.attendance.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'PRESENT' }) }),
    );
  });

  it('throws NotFoundError when the owning employee does not exist', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue(null);

    const result = updateAttendance('attendance-1', { events: [] });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_NOT_FOUND });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the owning employee is terminated', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue({
      ...activeEmployee,
      employmentStatus: 'TERMINATED',
    } as never);

    const result = updateAttendance('attendance-1', { events: [] });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_NOT_ACTIVE });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('allows updates for an employee who is on leave', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue({
      ...activeEmployee,
      employmentStatus: 'ON_LEAVE',
    } as never);

    await updateAttendance('attendance-1', {
      events: [
        {
          id: 'event-1',
          type: 'CLOCK_IN',
          occurredAt: existingClockIn.occurredAt,
          reason: 'Start',
        },
      ],
    });

    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it('throws BadRequestError when the owning employee user account is not active', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue({
      ...activeEmployee,
      user: { status: 'SUSPENDED' },
    } as never);

    const result = updateAttendance('attendance-1', { events: [] });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_USER_INACTIVE });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('marks the attendance ABSENT and clears summary fields when all events are removed', async () => {
    const result = await updateAttendance('attendance-1', { events: [] });

    expect(prisma.attendanceEvent.deleteMany).toHaveBeenCalledWith({
      where: { attendanceId: 'attendance-1' },
    });
    expect(prisma.attendance.update).toHaveBeenCalledWith({
      where: { id: 'attendance-1' },
      data: {
        status: 'ABSENT',
        completionStatus: null,
        firstClockIn: null,
        lastClockOut: null,
        workedMinutes: 0,
        hasManualChanges: true,
      },
    });
    expect(result.id).toBe('attendance-1');
  });

  it('throws BadRequestError when the first event is not a clock in', async () => {
    const result = updateAttendance('attendance-1', {
      events: [
        { type: 'CLOCK_OUT', occurredAt: new Date('2026-07-19T08:00:00.000Z'), reason: 'x' },
      ],
    });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({
      code: ERROR_CODES.ATTENDANCE_EVENTS_NOT_ALTERNATING,
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when events do not alternate', async () => {
    const result = updateAttendance('attendance-1', {
      events: [
        { type: 'CLOCK_IN', occurredAt: new Date('2026-07-19T08:00:00.000Z'), reason: 'x' },
        { type: 'CLOCK_IN', occurredAt: new Date('2026-07-19T09:00:00.000Z'), reason: 'y' },
      ],
    });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({
      code: ERROR_CODES.ATTENDANCE_EVENTS_NOT_ALTERNATING,
    });
  });

  it('throws BadRequestError when events are submitted out of chronological order', async () => {
    const result = updateAttendance('attendance-1', {
      events: [
        { type: 'CLOCK_IN', occurredAt: new Date('2026-07-19T13:00:00.000Z'), reason: 'x' },
        { type: 'CLOCK_OUT', occurredAt: new Date('2026-07-19T09:00:00.000Z'), reason: 'y' },
      ],
    });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({
      code: ERROR_CODES.ATTENDANCE_EVENTS_NOT_CHRONOLOGICAL,
    });
  });

  it('throws BadRequestError when two events share the same timestamp', async () => {
    const clockIn = new Date('2026-07-19T08:00:00.000Z');

    const result = updateAttendance('attendance-1', {
      events: [
        { type: 'CLOCK_IN', occurredAt: clockIn, reason: 'x' },
        { type: 'CLOCK_OUT', occurredAt: clockIn, reason: 'y' },
      ],
    });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({
      code: ERROR_CODES.ATTENDANCE_DUPLICATE_EVENT_TIME,
    });
  });

  it('throws BadRequestError when an event falls outside the attendance date', async () => {
    const result = updateAttendance('attendance-1', {
      events: [{ type: 'CLOCK_IN', occurredAt: new Date('2026-07-20T08:00:00.000Z'), reason: 'x' }],
    });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({
      code: ERROR_CODES.ATTENDANCE_EVENT_OUTSIDE_DATE,
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when more than 20 events are submitted', async () => {
    const dayStart = new Date('2026-07-19T08:00:00.000Z').getTime();

    const events: { type: 'CLOCK_IN' | 'CLOCK_OUT'; occurredAt: Date; reason: string }[] =
      Array.from({ length: 21 }, (_, index) => ({
        type: index % 2 === 0 ? 'CLOCK_IN' : 'CLOCK_OUT',
        occurredAt: new Date(dayStart + index * 5 * 60_000),
        reason: 'x',
      }));

    const result = updateAttendance('attendance-1', { events });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({
      code: ERROR_CODES.ATTENDANCE_TOO_MANY_EVENTS,
    });
  });

  it('deletes events that were removed from the submitted list', async () => {
    await updateAttendance('attendance-1', {
      events: [
        {
          id: 'event-1',
          type: 'CLOCK_IN',
          occurredAt: existingClockIn.occurredAt,
          reason: 'Start',
        },
      ],
    });

    expect(prisma.attendanceEvent.delete).toHaveBeenCalledWith({ where: { id: 'event-2' } });
    expect(prisma.attendanceEvent.update).toHaveBeenCalledWith({
      where: { id: 'event-1' },
      data: {
        type: 'CLOCK_IN',
        occurredAt: existingClockIn.occurredAt,
        reason: 'Start',
        method: 'MANUAL',
      },
    });
    expect(prisma.attendanceEvent.createMany).not.toHaveBeenCalled();
  });

  it('leaves untouched events alone and does not flip hasManualChanges when nothing changed', async () => {
    await updateAttendance('attendance-1', {
      events: [
        {
          id: 'event-1',
          type: 'CLOCK_IN',
          occurredAt: existingClockIn.occurredAt,
          reason: existingClockIn.reason,
        },
        {
          id: 'event-2',
          type: 'CLOCK_OUT',
          occurredAt: existingClockOut.occurredAt,
          reason: existingClockOut.reason,
        },
      ],
    });

    expect(prisma.attendanceEvent.update).not.toHaveBeenCalled();
    expect(prisma.attendanceEvent.delete).not.toHaveBeenCalled();
    expect(prisma.attendanceEvent.createMany).not.toHaveBeenCalled();
    expect(prisma.attendance.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ hasManualChanges: false }) }),
    );
  });

  it('only stamps MANUAL on the event that actually changed, leaving its sibling alone', async () => {
    await updateAttendance('attendance-1', {
      events: [
        {
          id: 'event-1',
          type: 'CLOCK_IN',
          occurredAt: existingClockIn.occurredAt,
          reason: existingClockIn.reason,
        },
        {
          id: 'event-2',
          type: 'CLOCK_OUT',
          occurredAt: new Date('2026-07-19T18:00:00.000Z'),
          reason: existingClockOut.reason,
        },
      ],
    });

    expect(prisma.attendanceEvent.update).toHaveBeenCalledTimes(1);
    expect(prisma.attendanceEvent.update).toHaveBeenCalledWith({
      where: { id: 'event-2' },
      data: {
        type: 'CLOCK_OUT',
        occurredAt: new Date('2026-07-19T18:00:00.000Z'),
        reason: existingClockOut.reason,
        method: 'MANUAL',
      },
    });
  });

  it('creates new events, forces status to PRESENT, and computes the resulting summary', async () => {
    const newClockOut = new Date('2026-07-19T18:00:00.000Z');

    const result = await updateAttendance('attendance-1', {
      events: [
        {
          id: 'event-1',
          type: 'CLOCK_IN',
          occurredAt: existingClockIn.occurredAt,
          reason: 'Start',
        },
        { type: 'CLOCK_OUT', occurredAt: newClockOut, reason: 'Left late' },
      ],
    });

    expect(prisma.attendanceEvent.delete).toHaveBeenCalledWith({ where: { id: 'event-2' } });
    expect(prisma.attendanceEvent.createMany).toHaveBeenCalledWith({
      data: [
        {
          attendanceId: 'attendance-1',
          type: 'CLOCK_OUT',
          occurredAt: newClockOut,
          method: 'MANUAL',
          reason: 'Left late',
        },
      ],
    });
    expect(prisma.attendance.update).toHaveBeenCalledWith({
      where: { id: 'attendance-1' },
      data: {
        status: 'PRESENT',
        completionStatus: 'COMPLETE',
        firstClockIn: existingClockIn.occurredAt,
        lastClockOut: newClockOut,
        workedMinutes: 540,
        hasManualChanges: true,
      },
    });
    expect(result.id).toBe('attendance-1');
  });
});
