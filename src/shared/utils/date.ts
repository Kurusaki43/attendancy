const MS_PER_DAY = 86_400_000;

export function startOfUtcDay(date: Date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function parseUtcDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function subUtcDays(date: Date, days: number): Date {
  return new Date(date.getTime() - days * MS_PER_DAY);
}

export const WEEKEND_DAYS: number[] = [0, 6];

export function isUtcWeekend(date: Date): boolean {
  return WEEKEND_DAYS.includes(date.getUTCDay());
}
