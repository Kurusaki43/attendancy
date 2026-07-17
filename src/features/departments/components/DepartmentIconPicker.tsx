'use client';

import type { Control } from 'react-hook-form';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import type { CreateDepartmentInput } from '@/server/departments/schemas/create-department.schema';
import type { UpdateDepartmentInput } from '@/server/departments/schemas/update-department.schema';

import { DEPARTMENT_ICON_OPTIONS } from '../lib/department-visuals';

type DepartmentIconPickerProps = {
  control: Control<CreateDepartmentInput | UpdateDepartmentInput>;
  disabled?: boolean;
};

export function DepartmentIconPicker({ control, disabled }: DepartmentIconPickerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Icon</CardTitle>
        <CardDescription>Choose an icon to represent this department</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="icon"
          render={({ field }) => (
            <div className="grid grid-cols-5 gap-2">
              {DEPARTMENT_ICON_OPTIONS.map((option) => {
                const OptionIcon = option.icon;
                const selected = field.value === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    title={option.label}
                    disabled={disabled}
                    onClick={() => field.onChange(selected ? undefined : option.value)}
                    className={cn(
                      'text-muted-foreground hover:bg-muted flex aspect-square items-center justify-center rounded-md border transition-colors',
                      selected && 'border-primary bg-primary/10 text-primary',
                    )}
                  >
                    <OptionIcon className="size-6" />
                  </button>
                );
              })}
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}
