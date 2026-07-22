import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Prisma } from '@/generated/prisma/client';
import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/attendance.repository', () => ({
  attendanceRepository: {
    findByEmployeeAndDate: vi.fn(),
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
    $transaction: vi.fn(),
  },
}));

const { attendanceRepository } = await import('../../repositories/attendance.repository');
const { employeeRepository } = await import('@/server/employees/repositories/employee.repository');
const { prisma } = await import('@/lib/prisma');
const { BadRequestError } = await import('@/lib/errors/bad-request.error');
const { ConflictError } = await import('@/lib/errors/conflict.error');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { createAttendance } = await import('../../services/create-attendance.service');

const fakeTx = {
  attendance: { create: vi.fn() },
  attendanceEvent: { createMany: vi.fn() },
};

const activeEmployee = {
  id: 'employee-1',
  employmentStatus: 'ACTIVE',
  hireDate: new Date(Date.UTC(2020, 0, 1)),
  user: { status: 'ACTIVE' },
};

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(employeeRepository.findById).mockResolvedValue(activeEmployee as never);
  vi.mocked(attendanceRepository.findByEmployeeAndDate).mockResolvedValue(null);

  fakeTx.attendance.create.mockResolvedValue({ id: 'attendance-1' });
  fakeTx.attendanceEvent.createMany.mockResolvedValue({ count: 0 });

  vi.mocked(prisma.$transaction).mockImplementation(((callback: (tx: typeof fakeTx) => unknown) =>
    callback(fakeTx)) as never);

  vi.mocked(attendanceRepository.findById).mockResolvedValue({ id: 'attendance-1' } as never);
});

describe('createAttendance', () => {
  it('throws NotFoundError when the employee does not exist', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue(null);

    const result = createAttendance({
      employeeId: 'missing',
      date: '2026-07-19',
      events: [{ type: 'CLOCK_IN', occurredAt: new Date('2026-07-19T08:00:00.000Z'), reason: 'x' }],
    });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_NOT_FOUND });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the employee is terminated', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue({
      ...activeEmployee,
      employmentStatus: 'TERMINATED',
    } as never);

    const result = createAttendance({
      employeeId: 'employee-1',
      date: '2026-07-19',
      events: [{ type: 'CLOCK_IN', occurredAt: new Date('2026-07-19T08:00:00.000Z'), reason: 'x' }],
    });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_NOT_ACTIVE });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the employee user account is not active', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue({
      ...activeEmployee,
      user: { status: 'SUSPENDED' },
    } as never);

    const result = createAttendance({
      employeeId: 'employee-1',
      date: '2026-07-19',
      events: [{ type: 'CLOCK_IN', occurredAt: new Date('2026-07-19T08:00:00.000Z'), reason: 'x' }],
    });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_USER_INACTIVE });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the attendance date is in the future', async () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const isoDate = tomorrow.toISOString().slice(0, 10);

    const result = createAttendance({
      employeeId: 'employee-1',
      date: isoDate,
      events: [{ type: 'CLOCK_IN', occurredAt: new Date(`${isoDate}T08:00:00.000Z`), reason: 'x' }],
    });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.ATTENDANCE_DATE_IN_FUTURE });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the date is before the employee hire date', async () => {
    const result = createAttendance({
      employeeId: 'employee-1',
      date: '2019-12-31',
      events: [{ type: 'CLOCK_IN', occurredAt: new Date('2019-12-31T08:00:00.000Z'), reason: 'x' }],
    });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({
      code: ERROR_CODES.ATTENDANCE_DATE_BEFORE_HIRE_DATE,
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws ConflictError when an attendance record already exists for that employee/date', async () => {
    vi.mocked(attendanceRepository.findByEmployeeAndDate).mockResolvedValue({
      id: 'existing',
    } as never);

    const result = createAttendance({
      employeeId: 'employee-1',
      date: '2026-07-19',
      events: [{ type: 'CLOCK_IN', occurredAt: new Date('2026-07-19T08:00:00.000Z'), reason: 'x' }],
    });

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({
      code: ERROR_CODES.ATTENDANCE_ALREADY_EXISTS_FOR_DATE,
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws ConflictError when a concurrent request wins the race to insert first', async () => {
    vi.mocked(prisma.$transaction).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (`employeeId`,`date`)',
        {
          code: 'P2002',
          clientVersion: '7.8.0',
          meta: { target: ['employeeId', 'date'] },
        },
      ),
    );

    const result = createAttendance({
      employeeId: 'employee-1',
      date: '2026-07-19',
      events: [{ type: 'CLOCK_IN', occurredAt: new Date('2026-07-19T08:00:00.000Z'), reason: 'x' }],
    });

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({
      code: ERROR_CODES.ATTENDANCE_ALREADY_EXISTS_FOR_DATE,
    });
  });

  it('rethrows other transaction errors unchanged', async () => {
    const dbError = new Error('connection lost');
    vi.mocked(prisma.$transaction).mockRejectedValue(dbError);

    const result = createAttendance({
      employeeId: 'employee-1',
      date: '2026-07-19',
      events: [{ type: 'CLOCK_IN', occurredAt: new Date('2026-07-19T08:00:00.000Z'), reason: 'x' }],
    });

    await expect(result).rejects.toBe(dbError);
  });

  it('throws BadRequestError when no events are submitted', async () => {
    const result = createAttendance({
      employeeId: 'employee-1',
      date: '2026-07-19',
      events: [],
    });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.ATTENDANCE_EVENTS_REQUIRED });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the first event is not a clock in', async () => {
    const result = createAttendance({
      employeeId: 'employee-1',
      date: '2026-07-19',
      events: [
        { type: 'CLOCK_OUT', occurredAt: new Date('2026-07-19T08:00:00.000Z'), reason: 'x' },
      ],
    });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({
      code: ERROR_CODES.ATTENDANCE_EVENTS_NOT_ALTERNATING,
    });
  });

  it('throws BadRequestError when events are submitted out of chronological order', async () => {
    const result = createAttendance({
      employeeId: 'employee-1',
      date: '2026-07-19',
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

  it('throws BadRequestError when events do not alternate', async () => {
    const result = createAttendance({
      employeeId: 'employee-1',
      date: '2026-07-19',
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

  it('throws BadRequestError when more than 20 events are submitted', async () => {
    const dayStart = new Date('2026-07-19T08:00:00.000Z').getTime();

    const events: { type: 'CLOCK_IN' | 'CLOCK_OUT'; occurredAt: Date; reason: string }[] =
      Array.from({ length: 21 }, (_, index) => ({
        type: index % 2 === 0 ? 'CLOCK_IN' : 'CLOCK_OUT',
        occurredAt: new Date(dayStart + index * 5 * 60_000),
        reason: 'x',
      }));

    const result = createAttendance({
      employeeId: 'employee-1',
      date: '2026-07-19',
      events,
    });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({
      code: ERROR_CODES.ATTENDANCE_TOO_MANY_EVENTS,
    });
  });

  it('throws BadRequestError when two events share the same timestamp', async () => {
    const clockIn = new Date('2026-07-19T08:00:00.000Z');

    const result = createAttendance({
      employeeId: 'employee-1',
      date: '2026-07-19',
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

  it('throws BadRequestError when an event falls outside the selected date', async () => {
    const result = createAttendance({
      employeeId: 'employee-1',
      date: '2026-07-19',
      events: [{ type: 'CLOCK_IN', occurredAt: new Date('2026-07-20T08:00:00.000Z'), reason: 'x' }],
    });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({
      code: ERROR_CODES.ATTENDANCE_EVENT_OUTSIDE_DATE,
    });
  });

  it('writes MANUAL events and computes the summary from them', async () => {
    const clockIn = new Date('2026-07-19T08:00:00.000Z');
    const clockOut = new Date('2026-07-19T17:00:00.000Z');

    await createAttendance({
      employeeId: 'employee-1',
      date: '2026-07-19',
      events: [
        { type: 'CLOCK_IN', occurredAt: clockIn, reason: 'Start of day' },
        { type: 'CLOCK_OUT', occurredAt: clockOut, reason: 'End of day' },
      ],
    });

    expect(fakeTx.attendance.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'PRESENT',
          completionStatus: 'COMPLETE',
          firstClockIn: clockIn,
          lastClockOut: clockOut,
          workedMinutes: 540,
        }),
      }),
    );
    expect(fakeTx.attendanceEvent.createMany).toHaveBeenCalledWith({
      data: [
        {
          attendanceId: 'attendance-1',
          type: 'CLOCK_IN',
          occurredAt: clockIn,
          method: 'MANUAL',
          reason: 'Start of day',
        },
        {
          attendanceId: 'attendance-1',
          type: 'CLOCK_OUT',
          occurredAt: clockOut,
          method: 'MANUAL',
          reason: 'End of day',
        },
      ],
    });
  });

  it('marks a lone Clock In as INCOMPLETE', async () => {
    await createAttendance({
      employeeId: 'employee-1',
      date: '2026-07-19',
      events: [
        { type: 'CLOCK_IN', occurredAt: new Date('2026-07-19T08:00:00.000Z'), reason: 'Start' },
      ],
    });

    expect(fakeTx.attendance.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'PRESENT',
          completionStatus: 'INCOMPLETE',
        }),
      }),
    );
  });
});
