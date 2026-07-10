'use client';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useQueryParams } from '@/hooks/use-query-params';

const EXCLUDED = ['page', 'limit'];

export default function ClearFiltersButton() {
  const { getAll, setParams } = useQueryParams();

  const params = getAll();

  const filterKeys = Object.keys(params).filter((k) => !EXCLUDED.includes(k));

  if (!filterKeys.length) return null;

  const handleClear = () => {
    const updates = Object.fromEntries(filterKeys.map((key) => [key, null]));

    setParams(updates, {
      resetPage: false,
    });
  };

  return (
    <Button variant="outline" onClick={handleClear}>
      <X data-icon="inline-start" />
      Clear
    </Button>
  );
}
