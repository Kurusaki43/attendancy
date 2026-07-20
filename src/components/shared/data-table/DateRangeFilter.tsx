'use client';

import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useId } from 'react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import { useQueryParams } from '@/hooks/use-query-params';
import { cn } from '@/lib/utils';
import { DATE_FORMAT, formatDate } from '@/shared/utils/format-date';

type DateRangeFilterProps = {
  fromQueryKey?: string;
  toQueryKey?: string;
  label?: string;
};

export default function DateRangeFilter({
  fromQueryKey = 'dateFrom',
  toQueryKey = 'dateTo',
  label = 'Date range',
}: DateRangeFilterProps) {
  const { getParam, setParams } = useQueryParams();
  const userLocale = useUserLocale();
  const triggerId = useId();

  const fromParam = getParam(fromQueryKey);
  const toParam = getParam(toQueryKey);

  const range: DateRange | undefined = fromParam
    ? { from: parseISO(fromParam), to: toParam ? parseISO(toParam) : undefined }
    : undefined;

  function handleSelect(newRange: DateRange | undefined) {
    setParams({
      [fromQueryKey]: newRange?.from ? format(newRange.from, 'yyyy-MM-dd') : null,
      [toQueryKey]: newRange?.to ? format(newRange.to, 'yyyy-MM-dd') : null,
    });
  }

  return (
    <div className="relative">
      <label
        htmlFor={triggerId}
        className="bg-card text-muted-foreground absolute -top-2 left-2 z-10 px-1 text-xs font-medium"
      >
        {label}
      </label>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              id={triggerId}
              variant="outline"
              className={cn(
                'bg-card hover:bg-card min-w-56 justify-start font-light',
                range?.from && 'border-ring ring-ring/50 ring-2',
              )}
            />
          }
        >
          <CalendarIcon data-icon="inline-start" />
          {range?.from ? (
            range.to ? (
              <>
                {formatDate(range.from, { ...userLocale, ...DATE_FORMAT })} –{' '}
                {formatDate(range.to, { ...userLocale, ...DATE_FORMAT })}
              </>
            ) : (
              formatDate(range.from, { ...userLocale, ...DATE_FORMAT })
            )
          ) : (
            <span className="text-muted-foreground">Default Range</span>
          )}
        </PopoverTrigger>

        <PopoverContent align="start">
          <Calendar
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
