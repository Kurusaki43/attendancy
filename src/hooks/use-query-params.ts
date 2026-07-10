'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = useCallback((key: string) => searchParams.get(key), [searchParams]);

  const getAll = useCallback(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  const setParam = useCallback(
    (
      key: string,
      value?: string | number | null,
      options?: { resetPage?: boolean; scroll?: boolean },
    ) => {
      const params = new URLSearchParams(window.location.search.toString());

      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }

      if (options?.resetPage ?? true) {
        params.delete('page');
      }

      const query = params.toString();

      const current = window.location.search.slice(1);
      if (query === current) {
        return;
      }

      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: options?.scroll ?? false,
      });
    },
    [pathname, router],
  );

  const setParams = useCallback(
    (
      updates: Record<string, string | number | null | undefined>,
      options?: { resetPage?: boolean; scroll?: boolean },
    ) => {
      const params = new URLSearchParams(window.location.search.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      if (options?.resetPage ?? true) {
        params.delete('page');
      }

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: options?.scroll ?? false,
      });
    },
    [pathname, router],
  );

  const removeParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(window.location.search.toString());

      params.delete(key);

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const clear = useCallback(
    (options?: { preserve?: string[]; scroll?: boolean }) => {
      const params = new URLSearchParams(window.location.search);

      for (const key of Array.from(params.keys())) {
        if (!options?.preserve?.includes(key)) {
          params.delete(key);
        }
      }

      const next = params.toString();
      const current = window.location.search.slice(1);

      if (next === current) return;

      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: options?.scroll ?? false,
      });
    },
    [pathname, router],
  );

  return {
    searchParams,
    getParam,
    getAll,
    setParam,
    setParams,
    removeParam,
    clear,
  };
}
