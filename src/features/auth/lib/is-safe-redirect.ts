// Only allow redirecting back into /dashboard/* after login — an allowlist instead of a generic
// same-origin check, since the redirect target comes from a client-suppliable query param and
// this is the only destination the app ever needs to send a user back to.
export const isSafeRedirect = (path?: string): path is string =>
  Boolean(path && /^\/dashboard(\/.*)?$/.test(path));
