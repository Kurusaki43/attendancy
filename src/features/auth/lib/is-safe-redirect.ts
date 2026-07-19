// Only allow redirecting back into /dashboard/* or /attendance-scan after login — an allowlist
// instead of a generic same-origin check, since the redirect target comes from a
// client-suppliable query param and these are the only destinations the app ever needs to send a
// user back to. /attendance-scan carries its one-time token as a query string, so its pattern
// must allow (not require) a `?...` suffix.
export const isSafeRedirect = (path?: string): path is string =>
  Boolean(path && /^(\/dashboard(\/.*)?|\/attendance-scan(\?.*)?)$/.test(path));
