'use client';

import { Filter } from 'lucide-react';
import { useId } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueryParams } from '@/hooks/use-query-params';
import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string;
};

type FilterSelectProps = {
  queryKey: string;
  label: string;
  placeholder?: string;
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
  const id = useId();

  const value = getParam(queryKey) ?? DEFAULT_VALUE;
  const isActive = value !== DEFAULT_VALUE;

  const handleValueChange = (newValue: string | null) => {
    setParam(queryKey, newValue === DEFAULT_VALUE ? null : newValue);
  };

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="bg-card text-muted-foreground absolute -top-2 left-2 z-10 px-1 text-xs font-medium"
      >
        {label}
      </label>

      <Filter
        className="text-muted-foreground absolute top-1/2 left-2 z-10 -translate-y-1/2"
        size={16}
      />

      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger
          id={id}
          className={cn('min-w-36 ps-7', isActive && 'border-ring ring-ring/50 ring-2')}
        >
          <SelectValue placeholder={placeholder} className="text-sm font-light">
            {(selected: string) =>
              selected === DEFAULT_VALUE
                ? defaultLabel
                : options.find((option) => option.value === selected)?.label
            }
          </SelectValue>
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
