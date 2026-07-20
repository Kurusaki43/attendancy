'use client';

import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  type AttendanceEmployeeOption,
  toEmployeeOption,
} from '@/features/attendance/lib/attendance-employee-option';
import { UserAvatar } from '@/features/dashboard/components/UserAvatar';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { getAllEmployeesAction } from '@/server/employees/actions/get-all-employees.action';

const SEARCH_RESULTS_LIMIT = '20';

type EmployeeComboboxProps = {
  value: AttendanceEmployeeOption | null;
  onChange: (employee: AttendanceEmployeeOption) => void;
  disabled?: boolean;
};

export function EmployeeCombobox({ value, onChange, disabled }: EmployeeComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AttendanceEmployeeOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = async (search: string) => {
    setIsSearching(true);

    try {
      const result = await getAllEmployeesAction({
        limit: SEARCH_RESULTS_LIMIT,
        sort: 'employeeCode',
        ...(search && { search }),
      });

      if (result.success) {
        setResults(result.data.employees.map(toEmployeeOption));
      } else {
        toast.error(result.message ?? 'Failed to search employees.');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  const { debounced: debouncedSearch, cancel: cancelSearch } = useDebouncedCallback(
    (search: string) => runSearch(search),
    300,
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      if (!hasSearched) void runSearch('');
    } else {
      cancelSearch();
      setQuery('');
    }
  };

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    debouncedSearch(nextQuery);
  };

  const handleSelect = (employee: AttendanceEmployeeOption) => {
    onChange(employee);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="bg-card h-auto min-h-9 w-full justify-between font-normal"
          />
        }
      >
        {value ? (
          <span className="flex items-center gap-2 py-2">
            <UserAvatar
              firstName={value.firstName}
              lastName={value.lastName}
              avatar={value.avatar}
              size="sm"
            />
            <span className="space-y-1 text-start">
              <p className="flex items-center gap-2">
                <span className="block font-medium">
                  {value.firstName} {value.lastName}
                </span>
                <Badge className="bg-primary/60 rounded-sm">{value.employeeCode}</Badge>
              </p>
              <span className="text-muted-foreground block text-xs">
                {[value.position, value.department].filter(Boolean).join(' • ')}
              </span>
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground capitalize">Select employee</span>
        )}
        <ChevronsUpDown className="text-muted-foreground size-4 shrink-0 opacity-50" />
      </PopoverTrigger>

      <PopoverContent className="w-[380px] max-w-[90vw] p-0" align="start">
        <div className="border-b p-2">
          <Input
            autoFocus
            placeholder="Search by name, email, or code..."
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
          />
        </div>

        <div className="max-h-64 overflow-y-auto p-1">
          {isSearching ? (
            <div className="text-muted-foreground flex items-center justify-center gap-2 p-4 text-sm">
              <Loader2 className="size-4 animate-spin" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground p-4 text-center text-sm">No employees found.</p>
          ) : (
            results.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                className="hover:bg-muted flex w-full items-center gap-2 rounded-sm p-2 text-start text-sm"
              >
                <UserAvatar
                  firstName={option.firstName}
                  lastName={option.lastName}
                  avatar={option.avatar}
                  size="sm"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">
                    {option.firstName} {option.lastName}
                  </span>

                  <span className="text-muted-foreground block truncate text-xs">
                    {[option.position, option.department].filter(Boolean).join(' • ')}
                  </span>
                </span>
                {value?.id === option.id && <Check className="size-4 shrink-0" />}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
