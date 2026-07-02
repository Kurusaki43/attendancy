'use client';

import type { ButtonProps } from '@base-ui/react';
import type { LucideIcon } from 'lucide-react';
import { Loader2, UserPlus } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
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
    <Button type="submit" disabled={disabled || pending} {...props}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}

      {pending ? loadingText : children}
    </Button>
  );
}
