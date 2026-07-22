import { Building2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DEPARTMENT_ICON_MAP } from '@/features/departments/lib/department-visuals';
import { cn } from '@/lib/utils';
import type { DepartmentResult } from '@/server/departments/types/action-results';

export function ParentCell({ parent }: { parent: DepartmentResult['parent'] }) {
  if (!parent) {
    return <span className="text-muted-foreground text-xs italic">Top-level</span>;
  }

  const Icon = (parent.icon && DEPARTMENT_ICON_MAP.get(parent.icon)) || Building2;

  return (
    <Badge variant="outline" className="gap-1.5 font-normal">
      <span
        className={cn(
          'flex size-3.5 shrink-0 items-center justify-center rounded-sm text-white',
          parent.color || 'bg-muted-foreground',
        )}
      >
        {/* eslint-disable-next-line react-hooks/static-components */}
        <Icon className="size-2.5" />
      </span>
      {parent.name}
    </Badge>
  );
}
