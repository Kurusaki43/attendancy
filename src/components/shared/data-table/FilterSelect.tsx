'use client';

import { Filter } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueryParams } from '@/hooks/use-query-params';

type Option = {
  label: string;
  value: string;
};

type FilterSelectProps = {
  queryKey: string;
  label: string;
  placeholder?: string;
  /** Label of the reset item that clears the filter from the URL. */
  defaultLabel?: string;
  options: Option[];
};

const DEFAULT_VALUE = 'all';

export default function FilterSelect({
  queryKey,
  label,
  placeholder = 'All',
  defaultLabel = 'All',
  options,
}: FilterSelectProps) {
  const { getParam, setParam } = useQueryParams();

  const value = getParam(queryKey) ?? DEFAULT_VALUE;

  const handleValueChange = (newValue: string | null) => {
    setParam(queryKey, newValue === DEFAULT_VALUE ? null : newValue);
  };

  return (
    <div className="relative">
      <Filter
        className="text-muted-foreground absolute top-1/2 left-2 z-10 -translate-y-1/2"
        size={16}
      />

      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="min-w-36 pl-7">
          <span className="text-muted-foreground mr-1">{label}:</span>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value={DEFAULT_VALUE}>{defaultLabel}</SelectItem>

            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
