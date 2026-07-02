'use client';

import { Eye, EyeOff, type LucideIcon } from 'lucide-react';
import React, { useState } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';
import { Input } from '../input';

type RHFInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  icon?: LucideIcon;
} & React.InputHTMLAttributes<HTMLInputElement>;

const RHFInput = <T extends FieldValues>({
  control,
  name,
  label,
  className,
  icon: Icon,
  type,
  ...props
}: RHFInputProps<T>) => {
  const [visible, setVisible] = useState(false);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            {label && (
              <FormLabel className="text-foreground" htmlFor={name}>
                {label}
              </FormLabel>
            )}

            <FormControl>
              <div className="relative">
                {Icon && (
                  <Icon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                )}

                <Input
                  id={name}
                  {...props}
                  {...field}
                  value={field.value ?? ''}
                  type={type !== 'password' ? type : visible ? 'text' : 'password'}
                  className={cn('py-4.5', Icon && 'pl-8', className)}
                />
                {type === 'password' && (
                  <div
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                    onClick={() => setVisible((prev) => !prev)}
                  >
                    {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </div>
                )}
              </div>
            </FormControl>

            <FormMessage className="text-xs font-light" />
          </FormItem>
        );
      }}
    />
  );
};

export default RHFInput;
