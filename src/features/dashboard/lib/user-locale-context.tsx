'use client';

import * as React from 'react';

type UserLocale = {
  locale: string | undefined;
  timezone: string | undefined;
};

const UserLocaleContext = React.createContext<UserLocale>({
  locale: undefined,
  timezone: undefined,
});

export function UserLocaleProvider({
  locale,
  timezone,
  children,
}: UserLocale & { children: React.ReactNode }) {
  return (
    <UserLocaleContext.Provider value={{ locale, timezone }}>{children}</UserLocaleContext.Provider>
  );
}

export function useUserLocale(): UserLocale {
  return React.useContext(UserLocaleContext);
}
