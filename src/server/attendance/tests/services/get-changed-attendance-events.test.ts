import { describe, expect, it } from 'vitest';

import { getChangedAttendanceEvents } from '../../lib/get-changed-attendance-events';

const originalClockIn = {
  id: 'event-1',
  type: 'CLOCK_IN' as const,
  occurredAt: new Date('2026-07-19T09:00:00.000Z'),
  reason: 'Start of day',
};
const originalClockOut = {
  id: 'event-2',
  type: 'CLOCK_OUT' as const,
  occurredAt: new Date('2026-07-19T17:00:00.000Z'),
  reason: 'End of day',
};

describe('getChangedAttendanceEvents', () => {
  it('excludes submitted events that are identical to their original', () => {
    const result = getChangedAttendanceEvents(
      [originalClockIn, originalClockOut],
      [
        {
          id: 'event-1',
          type: 'CLOCK_IN',
          occurredAt: originalClockIn.occurredAt,
          reason: 'Start of day',
        },
        {
          id: 'event-2',
          type: 'CLOCK_OUT',
          occurredAt: originalClockOut.occurredAt,
          reason: 'End of day',
        },
      ],
    );

    expect(result).toEqual([]);
  });

  it('includes a submitted event whose time differs from the original', () => {
    const changedTime = new Date('2026-07-19T18:00:00.000Z');

    const result = getChangedAttendanceEvents(
      [originalClockIn, originalClockOut],
      [
        {
          id: 'event-1',
          type: 'CLOCK_IN',
          occurredAt: originalClockIn.occurredAt,
          reason: 'Start of day',
        },
        { id: 'event-2', type: 'CLOCK_OUT', occurredAt: changedTime, reason: 'End of day' },
      ],
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('event-2');
  });

  it('includes a submitted event whose type or reason differs from the original', () => {
    const result = getChangedAttendanceEvents(
      [originalClockIn],
      [{ id: 'event-1', type: 'CLOCK_IN', occurredAt: originalClockIn.occurredAt, reason: 'Late' }],
    );

    expect(result).toHaveLength(1);
  });

  it('treats an empty/whitespace submitted reason as equivalent to a null original reason', () => {
    const noReasonOriginal = { ...originalClockIn, reason: null };

    const result = getChangedAttendanceEvents(
      [noReasonOriginal],
      [{ id: 'event-1', type: 'CLOCK_IN', occurredAt: originalClockIn.occurredAt, reason: '   ' }],
    );

    expect(result).toEqual([]);
  });

  it('includes submitted events with no id (new events) unconditionally', () => {
    const result = getChangedAttendanceEvents(
      [originalClockIn],
      [{ type: 'CLOCK_OUT', occurredAt: originalClockOut.occurredAt, reason: 'End of day' }],
    );

    expect(result).toHaveLength(1);
  });

  it('includes a submitted event whose id has no matching original', () => {
    const result = getChangedAttendanceEvents(
      [originalClockIn],
      [
        {
          id: 'missing-id',
          type: 'CLOCK_OUT',
          occurredAt: originalClockOut.occurredAt,
          reason: 'End of day',
        },
      ],
    );

    expect(result).toHaveLength(1);
  });
});
