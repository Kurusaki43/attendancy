'use client';

import { CalendarIcon } from 'lucide-react';
import { useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import { cn } from '@/lib/utils';
import { DATE_FORMAT, formatDate } from '@/shared/utils/format-date';

type DatePickerProps = {
  id?: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Calendar days strictly after this date are not selectable — e.g. pass `new Date()` to keep
   * a hire/birth date from being set in the future. */
  maxDate?: Date;
};

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Select date',
  disabled,
  className,
  maxDate,
}: DatePickerProps) {
  const userLocale = useUserLocale();
  const generatedId = useId();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id ?? generatedId}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn('bg-card w-full justify-start font-light', className)}
          />
        }
      >
        <CalendarIcon data-icon="inline-start" />
        {value ? (
          formatDate(value, { ...userLocale, ...DATE_FORMAT })
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </PopoverTrigger>

      <PopoverContent align="start">
        <Calendar
          mode="single"
          defaultMonth={value}
          selected={value}
          captionLayout="dropdown"
          disabled={maxDate ? { after: maxDate } : undefined}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
