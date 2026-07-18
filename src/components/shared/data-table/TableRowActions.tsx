'use client';

import { MoreVertical } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type TableRowActionsProps = {
  label: string;
  children: ReactNode;
};

export function TableRowActions({ label, children }: TableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label={label}>
            <MoreVertical />
          </Button>
        }
      />
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
