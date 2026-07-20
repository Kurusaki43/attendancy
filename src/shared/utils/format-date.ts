export type DateFormatOptions = Intl.DateTimeFormatOptions & {
  locale?: string;
  timezone?: string;
};

export function formatDate(
  date: Date | string | number,
  { locale, timezone, ...options }: DateFormatOptions = {},
): string {
  return new Intl.DateTimeFormat(locale, { timeZone: timezone, ...options }).format(new Date(date));
}

export const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
};

export const TIME_FORMAT: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit',
};

export const DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
  ...DATE_FORMAT,
  ...TIME_FORMAT,
};
