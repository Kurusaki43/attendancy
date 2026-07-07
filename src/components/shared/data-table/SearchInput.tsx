'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { useQueryParams } from '@/hooks/use-query-params';

export default function SearchInput({
  queryKey = 'search',
  placeholder = 'Search...',
}: {
  queryKey?: string;
  placeholder?: string;
}) {
  const { searchParams, setParam } = useQueryParams();

  const urlValue = searchParams.get(queryKey) ?? '';

  const [query, setQuery] = useState(urlValue);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(urlValue);
  }, [urlValue]);

  const { debounced, cancel } = useDebouncedCallback((value: string) => {
    setParam(queryKey, value);
  }, 300);

  return (
    <div className="relative w-full max-w-xs">
      <Input
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          debounced(value);
        }}
      />

      {query ? (
        <X
          className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
          size={16}
          onClick={() => {
            cancel();
            setQuery('');
            setParam(queryKey, null);
          }}
        />
      ) : (
        <Search className="absolute top-1/2 right-4 -translate-y-1/2" size={16} />
      )}
    </div>
  );
}
