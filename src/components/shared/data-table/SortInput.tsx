'use client';

import { ArrowUpDown } from 'lucide-react';
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

export type SortOption = {
  label: string;
  value: string;
};

type SortInputProps = {
  queryKey?: string;
  placeholder?: string;
  options: SortOption[];
  /** The sort value applied server-side when no `sort` param is present. Defaults to `options[0]`. */
  defaultValue?: string;
};

export default function SortInput({
  queryKey = 'sort',
  placeholder = 'Default',
  options,
  defaultValue = options[0]?.value,
}: SortInputProps) {
  const { getParam, setParam } = useQueryParams();
  const id = useId();

  const value = getParam(queryKey) ?? defaultValue;
  const isActive = value !== defaultValue;

  const handleChange = (value: string | null) => {
    setParam(queryKey, value === defaultValue ? null : value);
  };

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="bg-card text-muted-foreground absolute -top-2 left-2 z-10 px-1 text-xs font-medium"
      >
        Sort by
      </label>

      <ArrowUpDown
        className="text-muted-foreground absolute top-1/2 left-2 z-10 -translate-y-1/2"
        size={16}
      />

      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger
          id={id}
          className={cn('min-w-44 ps-7', isActive && 'border-ring ring-ring/50 ring-2')}
        >
          <SelectValue placeholder={placeholder} className="text-sm font-light">
            {(value: string) => options.find((option) => option.value === value)?.label}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
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
