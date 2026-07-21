import { describe, expect, it } from 'vitest';

import { computeAttendanceSummary } from '../../lib/compute-attendance-summary';

describe('computeAttendanceSummary', () => {
  it('returns nulls and zero minutes for an empty event list', () => {
    expect(computeAttendanceSummary([])).toEqual({
      firstClockIn: null,
      lastClockOut: null,
      workedMinutes: 0,
    });
  });

  it('sums worked minutes across multiple matched clock-in/out pairs', () => {
    const events = [
      { type: 'CLOCK_IN' as const, occurredAt: new Date('2026-07-19T09:15:00.000Z') },
      { type: 'CLOCK_OUT' as const, occurredAt: new Date('2026-07-19T12:30:00.000Z') },
      { type: 'CLOCK_IN' as const, occurredAt: new Date('2026-07-19T13:15:00.000Z') },
      { type: 'CLOCK_OUT' as const, occurredAt: new Date('2026-07-19T17:45:00.000Z') },
    ];

    const result = computeAttendanceSummary(events);

    expect(result.firstClockIn).toEqual(new Date('2026-07-19T09:15:00.000Z'));
    expect(result.lastClockOut).toEqual(new Date('2026-07-19T17:45:00.000Z'));
    expect(result.workedMinutes).toBe(465);
  });

  it('sorts out-of-order events before pairing them', () => {
    const events = [
      { type: 'CLOCK_OUT' as const, occurredAt: new Date('2026-07-19T17:00:00.000Z') },
      { type: 'CLOCK_IN' as const, occurredAt: new Date('2026-07-19T09:00:00.000Z') },
    ];

    const result = computeAttendanceSummary(events);

    expect(result.workedMinutes).toBe(480);
  });

  it('ignores an unmatched trailing clock-in', () => {
    const events = [
      { type: 'CLOCK_IN' as const, occurredAt: new Date('2026-07-19T09:00:00.000Z') },
      { type: 'CLOCK_OUT' as const, occurredAt: new Date('2026-07-19T12:00:00.000Z') },
      { type: 'CLOCK_IN' as const, occurredAt: new Date('2026-07-19T13:00:00.000Z') },
    ];

    const result = computeAttendanceSummary(events);

    expect(result.workedMinutes).toBe(180);
    expect(result.lastClockOut).toEqual(new Date('2026-07-19T12:00:00.000Z'));
  });

  it('replaces an open clock-in when a second clock-in arrives before any clock-out', () => {
    const events = [
      { type: 'CLOCK_IN' as const, occurredAt: new Date('2026-07-19T09:00:00.000Z') },
      { type: 'CLOCK_IN' as const, occurredAt: new Date('2026-07-19T10:00:00.000Z') },
      { type: 'CLOCK_OUT' as const, occurredAt: new Date('2026-07-19T11:00:00.000Z') },
    ];

    const result = computeAttendanceSummary(events);

    expect(result.firstClockIn).toEqual(new Date('2026-07-19T09:00:00.000Z'));
    expect(result.workedMinutes).toBe(60);
  });
});
