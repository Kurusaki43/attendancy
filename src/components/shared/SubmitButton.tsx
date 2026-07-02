'use client';

import type { ButtonProps } from '@base-ui/react';
import type { LucideIcon } from 'lucide-react';
import { Loader2, UserPlus } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
type SubmitButtonProps = ButtonProps & {
  loadingText?: string;
  icon?: LucideIcon;
  pending?: boolean;
};

export function SubmitButton({
  children,
  loadingText = 'Submitting...',
  disabled,
  pending = false,
  icon: Icon = UserPlus,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      {...props}
      className={cn(
        'focus-visible:ring-offset-background focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
        props.className,
      )}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}

      {pending ? loadingText : children}
    </Button>
  );
}
