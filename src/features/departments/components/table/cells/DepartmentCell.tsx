import { Building2 } from 'lucide-react';

import { DEPARTMENT_ICON_MAP } from '@/features/departments/lib/department-visuals';
import { cn } from '@/lib/utils';
import type { DepartmentResult } from '@/server/departments/types/action-results';

export function DepartmentCell({ department }: { department: DepartmentResult }) {
  const Icon = (department.icon && DEPARTMENT_ICON_MAP.get(department.icon)) || Building2;

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-md text-white',
          department.color || 'bg-muted text-muted-foreground',
        )}
      >
        {/* eslint-disable-next-line react-hooks/static-components */}
        <Icon className="size-4" />
      </span>
      <p className="text-foreground truncate font-medium">{department.name}</p>
    </div>
  );
}
