const MS_PER_DAY = 86_400_000;

// All attendance "calendar day" boundaries are computed in UTC rather than the process's
// ambient local timezone (date-fns's startOfDay/subDays/isWeekend use local time). Otherwise the
// same "day" resolves to a different instant depending on which machine/timezone runs the code —
// e.g. the seed script run from a host in one timezone vs. the app server running in another
// (typically UTC in Docker) — which desyncs stored dates from a same-day filter's boundaries.

/** Start of the given date's UTC calendar day. */
export function startOfUtcDay(date: Date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** Parses a 'YYYY-MM-DD' string as UTC midnight of that calendar day. */
export function parseUtcDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/** Subtracts whole days via fixed millisecond arithmetic, keeping a UTC-midnight instant aligned. */
export function subUtcDays(date: Date, days: number): Date {
  return new Date(date.getTime() - days * MS_PER_DAY);
}

/** True if the given UTC-midnight instant falls on a Saturday or Sunday in UTC. */
export function isUtcWeekend(date: Date): boolean {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}
