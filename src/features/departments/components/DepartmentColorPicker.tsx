'use client';

import type { Control } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { CreateDepartmentInput } from '@/server/departments/schemas/create-department.schema';
import type { UpdateDepartmentInput } from '@/server/departments/schemas/update-department.schema';

import { DEPARTMENT_COLOR_OPTIONS } from '../lib/department-visuals';

type DepartmentColorPickerProps = {
  control: Control<CreateDepartmentInput | UpdateDepartmentInput>;
  disabled?: boolean;
};

export function DepartmentColorPicker({ control, disabled }: DepartmentColorPickerProps) {
  return (
    <FormField
      control={control}
      name="color"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-medium tracking-wide">Department Color</FormLabel>
          <div className="flex items-center gap-2">
            <span className={cn('size-9 shrink-0 rounded-md border', field.value || 'bg-muted')} />
            <FormControl>
              <Input
                placeholder="bg-violet-500"
                {...field}
                value={field.value ?? ''}
                disabled={disabled}
              />
            </FormControl>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {DEPARTMENT_COLOR_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                title={option.label}
                onClick={() => field.onChange(option.value)}
                disabled={disabled}
                className={cn(
                  'size-5 rounded-full transition-transform hover:scale-110',
                  option.value,
                  field.value === option.value &&
                    'ring-ring ring-offset-background ring-2 ring-offset-2',
                )}
              />
            ))}
          </div>
          <p className="text-muted-foreground text-xs">
            Pick a swatch or type a Tailwind class (e.g. bg-violet-500)
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
