export function getBrowserLocaleAndTimezone() {
  return {
    locale: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}
