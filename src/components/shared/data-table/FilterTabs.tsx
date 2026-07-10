'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryParams } from '@/hooks/use-query-params';

type Option = {
  label: string;
  value: string;
};

type FilterTabsProps = {
  queryKey: string;
  options: Option[];
  allLabel?: string;
};

const DEFAULT_VALUE = 'all';

export default function FilterTabs({ queryKey, options, allLabel = 'All' }: FilterTabsProps) {
  const { getParam, setParam } = useQueryParams();

  const value = getParam(queryKey) ?? DEFAULT_VALUE;

  const handleValueChange = (newValue: unknown) => {
    setParam(queryKey, newValue === DEFAULT_VALUE ? null : (newValue as string));
  };

  return (
    <Tabs value={value} onValueChange={handleValueChange}>
      <TabsList>
        <TabsTrigger value={DEFAULT_VALUE}>{allLabel}</TabsTrigger>

        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
