'use client';

import { ArrowUpDown } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueryParams } from '@/hooks/use-query-params';

type SortOption = {
  label: string;
  value: string;
};

type SortInputProps = {
  queryKey?: string;
  placeholder?: string;
  options: SortOption[];
};

const DEFAULT_SORT = 'default';

export default function SortInput({
  queryKey = 'sort',
  placeholder = 'Default',
  options,
}: SortInputProps) {
  const { getParam, setParam } = useQueryParams();

  const value = getParam(queryKey) ?? DEFAULT_SORT;

  const handleChange = (value: string | null) => {
    setParam(queryKey, value === DEFAULT_SORT ? null : value);
  };

  return (
    <div className="relative">
      <ArrowUpDown
        className="text-muted-foreground absolute top-1/2 left-2 z-10 -translate-y-1/2"
        size={16}
      />

      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="min-w-44 pl-7">
          <span className="text-muted-foreground mr-1">Sort:</span>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value={DEFAULT_SORT}>Default</SelectItem>

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
